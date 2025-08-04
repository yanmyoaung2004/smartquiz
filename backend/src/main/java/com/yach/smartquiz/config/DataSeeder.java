package com.yach.smartquiz.config;

import com.yach.smartquiz.entity.Permission;
import com.yach.smartquiz.entity.Role;
import com.yach.smartquiz.entity.User;
import com.yach.smartquiz.service.PermissionService;
import com.yach.smartquiz.service.RoleService;
import com.yach.smartquiz.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Configuration
public class DataSeeder {

	private final RoleService roleService;
	private final UserService userService;
	private final PasswordEncoder passwordEncoder;
	private final PermissionService permissionService;

	public DataSeeder(RoleService roleService, UserService userService, PasswordEncoder passwordEncoder,
			PermissionService permissionService) {
		this.roleService = roleService;
		this.userService = userService;
		this.passwordEncoder = passwordEncoder;
		this.permissionService = permissionService;
	}

	@Bean
	CommandLineRunner seedRolesAndAdminUser() {
		return args -> {

			// === Create Permissions ===

			// --- Exam CRUD Permissions ---
			Permission examCreate = createIfMissing("EXAM_CREATE");
			Permission examList = createIfMissing("EXAM_LIST_GET");
			Permission examUpdate = createIfMissing("EXAM_UPDATE");
			Permission examDelete = createIfMissing("EXAM_DELETE");

			// --- Exam Permissions ---
			Permission examTake = createIfMissing("EXAM_TAKE");
			Permission examSubmit = createIfMissing("EXAM_SUBMIT");
			Permission examReview = createIfMissing("EXAM_REVIEW");
			Permission examDetail = createIfMissing("EXAM_DETAIL");
			Permission examCheckCode = createIfMissing("EXAM_CODE_CHECK");
			Permission examInvite = createIfMissing("EXAM_INVITE");
			Permission examAccept = createIfMissing("EXAM_ACCEPT");
			Permission examViewUpcoming = createIfMissing("EXAM_VIEW_UPCOMING");

			// --- Practice Permissions ---
			Permission practiceCreate = createIfMissing("EXAM_PRACTICE_CREATE");
			Permission practiceStart = createIfMissing("EXAM_PRACTICE_START");
			Permission practiceSubmit = createIfMissing("EXAM_PRACTICE_SUBMIT");
			Permission practiceResult = createIfMissing("EXAM_PRACTICE_RESULT");
			Permission practiceReview = createIfMissing("EXAM_PRACTICE_REVIEW");

			// --- Question Permissions ---
			Permission questionCreate = createIfMissing("QUESTION_CREATE");
			Permission questionUpdate = createIfMissing("QUESTION_UPDATE");
			Permission questionView = createIfMissing("QUESTION_VIEW");
			Permission questionDelete = createIfMissing("QUESTION_DELETE");

			// --- User Management Permissions ---
			Permission userDelete = createIfMissing("USER_DELETE");
			Permission userView = createIfMissing("USER_VIEW");
			Permission studentDelete = createIfMissing("STUDENT_DELETE");

			// === Create Roles ===

			// --- Admin Role (Full access) ---
			if (roleService.getRoleByName("ROLE_ADMIN") == null) {
				Role admin = new Role();
				admin.setName("ROLE_ADMIN");
				admin.setDescription("Admin Role");
				admin.setPermissions(new HashSet<>(Arrays.asList(examCreate, examList, examUpdate, examDelete, examTake,
						examSubmit, examReview, examDetail, examCheckCode, examInvite, examAccept, examViewUpcoming,
						practiceCreate, practiceStart, practiceSubmit, practiceResult, practiceReview, questionCreate,
						questionUpdate, questionView, questionDelete, userDelete, studentDelete, userView)));
				roleService.createRole(admin);
			}

			// --- Teacher Role (Exam and question management, limited user access) ---
			if (roleService.getRoleByName("ROLE_TEACHER") == null) {
				Role teacher = new Role();
				teacher.setName("ROLE_TEACHER");
				teacher.setDescription("Teacher Role");
				teacher.setPermissions(new HashSet<>(Arrays.asList(examCreate, examList, examUpdate, examDelete,
						examTake, examSubmit, examReview, examDetail, examCheckCode, examInvite, examAccept,
						examViewUpcoming, practiceCreate, practiceStart, practiceSubmit, practiceResult, practiceReview,
						questionCreate, questionUpdate, questionView)));
				roleService.createRole(teacher);
			}

			// --- Student Role (Exam & practice participation) ---
			if (roleService.getRoleByName("ROLE_STUDENT") == null) {
				Role student = new Role();
				student.setName("ROLE_STUDENT");
				student.setDescription("Student Role");
				student.setPermissions(new HashSet<>(
						Arrays.asList(examTake, examSubmit, examReview, examCheckCode, examAccept, examViewUpcoming,
								practiceCreate, practiceStart, practiceSubmit, practiceResult, practiceReview)));
				roleService.createRole(student);
			}

			// === Create Admin User ===

			String adminEmail = "admin@gmail.com";
			if (userService.getUserByEmailForExam(adminEmail) == null) {
				Role adminRole = roleService.getRoleByName("ROLE_ADMIN");

				User adminUser = new User();
				adminUser.setUsername("admin");
				adminUser.setEmail(adminEmail);
				adminUser.setPassword(passwordEncoder.encode("password"));
				adminUser.setRoles(Set.of(adminRole));
				adminUser.setEnabled(true);

				userService.createUser(adminUser);
				System.out.println("✅ Admin user created: admin@gmail.com / password");
			}
		};
	}

	@Bean("studentRole")
	@Lazy
	Role studentRole() {
		return roleService.getRoleByName("ROLE_STUDENT");
	}

	private Permission createIfMissing(String name) {
		Permission permission = permissionService.getPermissionByName(name);
		return (permission != null) ? permission : permissionService.createPermission(new Permission(name));
	}
}
