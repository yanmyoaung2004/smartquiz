package com.yach.smartquiz.service;

import com.yach.smartquiz.entity.User;
import com.yach.smartquiz.request.LoginUserRequest;
import com.yach.smartquiz.request.RegisterUserRequest;

public interface AuthenticationService {

	User signup(RegisterUserRequest userData);

	User authenticate(LoginUserRequest userData);

	User resetPassword(User user, String password);
	
	User handleOAuthAccountCreation(String email, String name, String imageUrl);

}
