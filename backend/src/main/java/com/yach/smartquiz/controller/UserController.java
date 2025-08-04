package com.yach.smartquiz.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.yach.smartquiz.custom_exception.NotFoundException;
import com.yach.smartquiz.entity.Exam;
import com.yach.smartquiz.entity.ExamInvitation;
import com.yach.smartquiz.entity.PracticeExam;
import com.yach.smartquiz.entity.QuestionType;
import com.yach.smartquiz.entity.Role;
import com.yach.smartquiz.entity.RoleRequest;
import com.yach.smartquiz.entity.Topic;
import com.yach.smartquiz.entity.User;
import com.yach.smartquiz.entity.UserAnswer;
import com.yach.smartquiz.entity.UserExam;
import com.yach.smartquiz.entity.UserTopicPerformanceDTO;
import com.yach.smartquiz.messaging.EmailProducer;
import com.yach.smartquiz.request.NotificationChangeRequest;
import com.yach.smartquiz.request.UserUpdateRequest;
import com.yach.smartquiz.response.ExamHistoryListResponse;
import com.yach.smartquiz.response.NotificationListResponse;
import com.yach.smartquiz.response.PracticeHistoryListAdminResponse;
import com.yach.smartquiz.response.PracticeHistoryListResponse;
import com.yach.smartquiz.response.UserDetailResponse;
import com.yach.smartquiz.response.UserListResponse;
import com.yach.smartquiz.service.ExamInvitationService;
import com.yach.smartquiz.service.ExamService;
import com.yach.smartquiz.service.PracticeExamService;
import com.yach.smartquiz.service.QuestionTypeService;
import com.yach.smartquiz.service.RoleRequestService;
import com.yach.smartquiz.service.RoleService;
import com.yach.smartquiz.service.UserAnswerService;
import com.yach.smartquiz.service.UserExamService;
import com.yach.smartquiz.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {

	private final UserService userService;
	private final QuestionTypeService questionTypeService;
	private final ExamInvitationService examInvitationService;
	private final UserAnswerService userAnswerService;
	private final UserExamService userExamService;
	private final PracticeExamService practiceExamService;
	private final RoleRequestService roleRequestService;
	private final RoleService roleService;
	private final ExamService examService;
	private final EmailProducer emailProducer;

	
	public UserController(UserService userService, QuestionTypeService questionTypeService,
			ExamInvitationService examInvitationService, UserAnswerService userAnswerService,
			UserExamService userExamService, PracticeExamService practiceExamService,
			RoleRequestService roleRequestService, RoleService roleService, ExamService examService,
			EmailProducer emailProducer) {
		super();
		this.userService = userService;
		this.questionTypeService = questionTypeService;
		this.examInvitationService = examInvitationService;
		this.userAnswerService = userAnswerService;
		this.userExamService = userExamService;
		this.practiceExamService = practiceExamService;
		this.roleRequestService = roleRequestService;
		this.roleService = roleService;
		this.examService = examService;
		this.emailProducer = emailProducer;
	}

	@PostMapping("/update")
	public ResponseEntity<String> updateUser(@RequestBody UserUpdateRequest request) {
		User existedUser = userService.getUserById(request.id());
		QuestionType questionType = questionTypeService.getQuestionTypeById(request.qusetionType());
		if (existedUser == null || questionType == null) {
			throw new NotFoundException("No Data Found!");
		}
		existedUser.setEmail(request.email());
		existedUser.setProfileImage(request.profileImage());
		existedUser.setUsername(request.username());
		existedUser.getUserSettings().setSelectedSubject(questionType);
		User user = userService.updateUser(existedUser);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("User update failed!");
		}
		return ResponseEntity.status(HttpStatus.OK).body("User update succeed!");
	}

	@GetMapping("/get-detail")
	public ResponseEntity<UserDetailResponse> updateUser(@RequestParam String email) {
		User user = userService.getUserByEmail(email);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
		}
		return ResponseEntity.status(HttpStatus.OK)
				.body(new UserDetailResponse(user.getId(), user.getEmail(), user.getUsername(), user.getProfileImage(),
						user.getUserSettings().isEmailNotificationsEnabled(),
						user.getUserSettings().isReminderNotificationsEnabled()));
	}

	@PostMapping("/update-noti-settings")
	public ResponseEntity<String> updateNotiSetting(@RequestBody NotificationChangeRequest request) {
		boolean emailNoti = request.emailNoti();
		boolean reminderNoti = request.reminderNoti();
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		user.getUserSettings().setEmailNotificationsEnabled(emailNoti);
		user.getUserSettings().setReminderNotificationsEnabled(reminderNoti);

		try {
			userService.updateUser(user);
			return ResponseEntity.ok("Notification settings updated successfully.");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Failed to update notification settings.");
		}
	}

	@GetMapping("/get-notifications")
	public ResponseEntity<List<NotificationListResponse>> getAllUserNotifications() {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		List<ExamInvitation> examInvitations = examInvitationService.getByEmail(user.getEmail());
		List<NotificationListResponse> notifications = examInvitations.stream()
				.map(e -> new NotificationListResponse(e.getId(), e.getExam().getName(),
						e.getExam().getCreatedBy().getName(), e.getExam().getName(),
						e.getExam().getStartDate().toString(), e.getExam().getEndDate().toString(), false,
						e.getExam().getQuestions().size(), e.getExam().getDuration(), e.getExam().getShortCode()))
				.collect(Collectors.toList());

		return ResponseEntity.ok(notifications);
	}

	private List<UserTopicPerformanceDTO> getPerformanceData() {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		QuestionType type = user.getUserSettings().getSelectedSubject();
		List<UserTopicPerformanceDTO> performanceData = userAnswerService.getUserTopicPerformance(user.getId(),
				type.getId());
		return performanceData;
	}

	private List<ExamHistoryListResponse> getExamHistory() {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		QuestionType type = user.getUserSettings().getSelectedSubject();
		List<UserExam> userExams = userExamService.getUserExamByUser(user);
		List<ExamHistoryListResponse> responses = userExams.stream()
				.sorted(Comparator.comparing(UserExam::getStartedAt).reversed()).filter(exam -> exam.getExam()
						.getQuestions().get(0).getTopic().getChapter().getType().getId().equals(type.getId()))
				.map(exam -> {
					Long examId = exam.getId();
					String examCode = exam.getExam().getShortCode();
					String title = exam.getExam().getName();
					Integer score = exam.getScore() != null
							? exam.getScore() * 100 / exam.getExam().getQuestions().size()
							: 0;

					String date = exam.getStartedAt().toLocalDate().toString();
					Integer duration = (int) java.time.Duration.between(exam.getStartedAt(), exam.getSubmittedAt())
							.toMinutes();

					int numberOfQuestions = exam.getExam().getQuestions().size();
					int passingScore = exam.getExam().getPassingScore();
					int scorePercentage = (score == null || numberOfQuestions == 0) ? 0 : score / numberOfQuestions;

					int passingPercentage = passingScore * 100 / numberOfQuestions;
					int remaining = 100 - passingPercentage;

					int justPassMax = passingPercentage + (remaining * 60 / 100);
					int goodMax = justPassMax + (remaining * 25 / 100);
					String status;
					if (scorePercentage < passingPercentage) {
						status = "Fail";
					} else if (scorePercentage <= justPassMax) {
						status = "Pass";
					} else if (scorePercentage <= goodMax) {
						status = "Good";
					} else {
						status = "Excellent";
					}
					return new ExamHistoryListResponse(examId, examCode, title, score, date, duration, status);
				}).toList();
		return responses;
	}

	private List<PracticeHistoryListResponse> getPracticeHistory() {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		QuestionType type = user.getUserSettings().getSelectedSubject();
		List<PracticeExam> practiceExams = practiceExamService.getByUser(user);
		List<PracticeHistoryListResponse> responses = practiceExams.stream()
				.filter(exam -> exam.getTopics().get(0).getChapter().getType().getId().equals(type.getId()))
				.sorted(Comparator.comparing(PracticeExam::getCreatedAt).reversed()).map(exam -> {
					Long practiceId = exam.getId();
					String examCode = exam.getShortCode();
					String title = exam.getTopics().stream().map(Topic::getName).collect(Collectors.joining(", "));
					List<UserAnswer> correctAnswers = userAnswerService.getCorrectAnswersByPracticeExam(exam);
					int correctCount = correctAnswers.size();
					int score = (int) Math.round((double) correctCount / exam.getNumberOfQuestions() * 100);
					String date = exam.getStartDate().toLocalDate().toString();
					String status = score > 90 ? "Excellent" : score > 75 ? "Good" : score > 60 ? "Pass" : "Fail";
					return new PracticeHistoryListResponse(practiceId, examCode, title, score, date, status);
				}).toList();
		return responses;
	}

	@GetMapping("get-practice")
	public ResponseEntity<List<PracticeHistoryListAdminResponse>> getAllPractice() {
		List<PracticeExam> practiceExams = practiceExamService.getAll();
		List<PracticeHistoryListAdminResponse> responses = practiceExams.stream()
				.sorted(Comparator.comparing(PracticeExam::getCreatedAt).reversed()).map(exam -> {
					Long practiceId = exam.getId();
					Long userId = exam.getUser().getId();
					String username = exam.getUser().getUsername();
					String imageUrl = exam.getUser().getProfileImage();
					String examCode = exam.getShortCode();
					String title = exam.getTopics().stream().map(Topic::getName).collect(Collectors.joining(", "));
					List<UserAnswer> correctAnswers = userAnswerService.getCorrectAnswersByPracticeExam(exam);
					int correctCount = correctAnswers.size();
					int score = (int) Math.round((double) correctCount / exam.getNumberOfQuestions() * 100);
					String date = exam.getStartDate().toLocalDate().toString();
					String status = score > 90 ? "Excellent" : score > 75 ? "Good" : score > 60 ? "Pass" : "Fail";
					return new PracticeHistoryListAdminResponse(practiceId, examCode, title, score, date, status,
							username, userId, imageUrl);
				}).toList();
		return ResponseEntity.ok(responses);
	}

	@GetMapping("get-exam")
	public ResponseEntity<List<PracticeHistoryListAdminResponse>> getAllExam() {
		List<Exam> exams = examService.getAllExam();
		List<PracticeHistoryListAdminResponse> responses = exams.stream().filter(exam -> exam.isPublic())
				.sorted(Comparator.comparing(Exam::getCreatedAt).reversed()).flatMap(exam -> {
					List<UserExam> userExams = userExamService.getAllUserExamByExam(exam);
					return userExams.stream().map(ue -> {
						Long examId = ue.getId();
						Long userId = ue.getUser().getId();
						String username = ue.getUser().getUsername();
						String imageUrl = ue.getUser().getProfileImage();
						String examCode = exam.getShortCode();
						String title = exam.getName();
						int correctCount = ue.getScore();
						int totalQuestions = exam.getQuestions().size();
						int score = (int) Math.round((double) correctCount / totalQuestions * 100);
						String date = exam.getStartDate().toLocalDate().toString();
						String status = score > 90 ? "Excellent" : score > 75 ? "Good" : score > 60 ? "Pass" : "Fail";
						return new PracticeHistoryListAdminResponse(examId, examCode, title, score, date, status,
								username, userId, imageUrl);
					});
				}).collect(Collectors.toList());

		return ResponseEntity.ok(responses);
	}

	private static String calculateImprovement(Double current, Double previous) {
		if (current == null)
			current = 0.0;
		if (previous == null || previous == 0.0)
			return "+0.0%";

		double diff = Math.round((current - previous) * 10.0) / 10.0;
		return (diff >= 0 ? "+" : "") + diff + "%";
	}

	private final String getImprovement() {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		LocalDateTime startOfThisMonth = YearMonth.now().atDay(1).atStartOfDay();
		Double currentScore = userAnswerService.getCurrentOverallScore(user.getId());
		Double previousScore = userAnswerService.getPreviousMonthOverallScore(user.getId(), startOfThisMonth);
		return calculateImprovement(currentScore, previousScore);
	}

	@GetMapping("/get-dashboard-data")
	public ResponseEntity<Map<String, Object>> getDashboardData() {
		List<UserTopicPerformanceDTO> performance = this.getPerformanceData();
		List<ExamHistoryListResponse> examHistory = this.getExamHistory();
		List<PracticeHistoryListResponse> practiceHistory = this.getPracticeHistory();
		Map<String, Object> response = new HashMap<>();
		response.put("performance", performance);
		response.put("examHistory", examHistory);
		response.put("practiceHistory", practiceHistory);
		response.put("improvement", this.getImprovement());
		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAuthority('USER_VIEW')")
	@GetMapping("/get-users")
	public ResponseEntity<List<UserListResponse>> getAllUser() {
		List<User> users = userService.getAllUserForAdmin();
		List<UserListResponse> response = users.stream().map(u -> {
			String roleNames = u.getRoles().stream().map(role -> role.getName()).collect(Collectors.joining(", "));
			return new UserListResponse(u.getId(), u.getName(), u.getEmail(), roleNames,
					u.isDisabled() ? "Deactive" : "Active", u.getProfileImage());
		}).toList();
		return ResponseEntity.ok(response);
	}

	@PutMapping("/toggleUserActive")
	public ResponseEntity<String> toggleUserActive(@RequestParam Long userId) {
		User user = userService.getUserById(userId);
		if (user == null) {
			return ResponseEntity.status(404).body("User not found");
		}

		user.setDisabled(!user.isDisabled());
		userService.updateUser(user);
		return ResponseEntity.ok("Successfully Updated");
	}

	@PostMapping(value = "/request-teacher-role", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> requestTeacherRole(@RequestParam MultipartFile file, @RequestParam String reason) {
		try {
			User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

			Optional<RoleRequest> existingRequest = roleRequestService.findByUserAndRoleName(user, "ROLE_TEACHER");

			if (existingRequest.isPresent()) {
				RoleRequest request = existingRequest.get();
				LocalDateTime createdAt = request.getCreatedAt();
				LocalDateTime now = LocalDateTime.now();

				if (createdAt.plusDays(30).isAfter(now)) {
					long daysRemaining = ChronoUnit.DAYS.between(now, createdAt.plusDays(30));
					return ResponseEntity.status(HttpStatus.CONFLICT)
							.body("You have already submitted a request for this role. You can reapply after "
									+ daysRemaining + " day(s).");
				}

				roleRequestService.deleteRoleRequest(request.getId());
			}

			String uploadDir = "/uploads/teacher_applications/";
			String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
			Path filePath = Paths.get(uploadDir + fileName);
			Files.createDirectories(filePath.getParent());
			Files.write(filePath, file.getBytes());

			Role teacherRole = roleService.getRoleByName("ROLE_TEACHER");
			RoleRequest roleRequest = new RoleRequest();
			roleRequest.setUser(user);
			roleRequest.setRole(teacherRole);
			roleRequest.setStatus("PENDING");
			roleRequest.setReason(reason);
			roleRequest.setApplicationFilePath(filePath.toString());

			roleRequestService.createRoleRequest(roleRequest);

			return ResponseEntity.ok("Your teacher role request has been submitted.");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error while submitting request: " + e.getMessage());
		}
	}

	@GetMapping("/role-request/user/teacher")
	public ResponseEntity<?> getTeacherRoleRequestByUser() {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Optional<RoleRequest> roleRequestOpt = roleRequestService.findByUserAndRoleName(user, "ROLE_TEACHER");
		if (roleRequestOpt.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body("No teacher role request found for user: " + user.getUsername());
		}
		RoleRequest roleRequest = roleRequestOpt.get();

		try {
			LocalDateTime createdAt = roleRequest.getCreatedAt();
			LocalDateTime now = LocalDateTime.now();
			boolean canReapply = createdAt.plusDays(30).isBefore(now);
			long daysUntilReapply = ChronoUnit.DAYS.between(now, createdAt.plusDays(30));

			Path filePath = Path.of(roleRequest.getApplicationFilePath());
			byte[] fileBytes = Files.readAllBytes(filePath);
			String fileBase64 = Base64.getEncoder().encodeToString(fileBytes);

			Map<String, Object> response = new HashMap<>();
			response.put("reason", roleRequest.getReason());
			response.put("status", roleRequest.getStatus());
			response.put("createdAt", roleRequest.getCreatedAt());
			response.put("fileName",
					filePath.getFileName().toString().substring(filePath.getFileName().toString().indexOf("_") + 1));
			response.put("fileData", fileBase64);
			response.put("canReapply", canReapply);
			response.put("daysUntilReapply", daysUntilReapply < 0 ? 0 : daysUntilReapply);

			return ResponseEntity.ok(response);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Failed to read uploaded file: " + e.getMessage());
		}
	}

	@GetMapping("/role-requests/teacher")
	public ResponseEntity<?> getAllTeacherRoleRequests() {
		try {
			List<RoleRequest> requests = roleRequestService.getAllRoleRequests();

			List<Map<String, Object>> responseList = requests.stream().map(request -> {
				Map<String, Object> map = new HashMap<>();
				Path filePath = Path.of(request.getApplicationFilePath());
				byte[] fileBytes;
				try {
					fileBytes = Files.readAllBytes(filePath);
					String fileBase64 = Base64.getEncoder().encodeToString(fileBytes);
					map.put("fileData", fileBase64);
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

				map.put("id", request.getId());
				map.put("name", request.getUser().getName());
				map.put("email", request.getUser().getEmail());
				map.put("requestedRole", "Teacher");
				map.put("requestDate", request.getCreatedAt().toLocalDate().toString());
				map.put("fileName", filePath.getFileName().toString()
						.substring(filePath.getFileName().toString().indexOf("_") + 1));
				map.put("reason", request.getReason());
				map.put("status", request.getStatus());
				map.put("avatar", request.getUser().getProfileImage() == null ? "/placeholder.svg?height=32&width=32"
						: request.getUser().getProfileImage());
				return map;
			}).collect(Collectors.toList());

			return ResponseEntity.ok(responseList);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Failed to fetch teacher role requests: " + e.getMessage());
		}
	}

	@GetMapping("/role-requests")
	public ResponseEntity<?> updateRoleRequestStatus(@RequestParam Long roleRequestId, @RequestParam String status) {
		Optional<RoleRequest> requestOpt = roleRequestService.getRoleRequestById(roleRequestId);
		if (requestOpt.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Role request not found");
		}
		RoleRequest request = requestOpt.get();
		String normalizedStatus = status.toUpperCase();
		

		if (!List.of("PENDING", "APPROVED", "REJECTED").contains(normalizedStatus)) {
			return ResponseEntity.badRequest().body("Invalid status value");
		}

		request.setStatus(normalizedStatus);

		if ("APPROVED".equals(normalizedStatus)) {
			Role teacherRole = roleService.getRoleByName("ROLE_TEACHER");
			User user = request.getUser();
			emailProducer.handleAcceptTeacherEmail(user);
			if (!user.getRoles().contains(teacherRole)) {
				user.getRoles().add(teacherRole);
				userService.updateUser(user);
			}
		}

		roleRequestService.updateRoleRequest(roleRequestId, request);

		return ResponseEntity.ok("Status updated successfully");
	}

	@GetMapping("/role-requests-user")
	public ResponseEntity<?> updateRoleRequestStatusByUserId(@RequestParam Long userId, @RequestParam String roleName) {
		User user = userService.getUserById(userId);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
		}

		Role role = roleService.getRoleByName(roleName);
		if (role == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Role not found");
		}
		user.getRoles().removeIf(r -> !r.getName().equals(role.getName()));
		boolean hasRole = user.getRoles().stream().anyMatch(r -> r.getName().equals(role.getName()));
		if (!hasRole) {
			user.getRoles().add(role);
		}
		userService.updateUser(user);
		return ResponseEntity.ok("User roles updated successfully");
	}

}
