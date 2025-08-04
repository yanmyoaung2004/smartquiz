package com.yach.smartquiz.service;

import java.util.List;

import com.yach.smartquiz.entity.User;

public interface UserService {

	User createUser(User user);
	
	User updateUser(User user);
	
	User getUserById(Long id);

	User getUserByEmail(String email);
	
	User getUserByEmailForExam(String email);
	
	List<User> getAllUserForAdmin();
	
//	User getUserByRoleForAdmin(Role role);
	
}


