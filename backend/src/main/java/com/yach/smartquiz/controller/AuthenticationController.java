package com.yach.smartquiz.controller;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yach.smartquiz.entity.User;
import com.yach.smartquiz.messaging.EmailProducer;
import com.yach.smartquiz.messaging.ForgotPasswordMessagingRequest;
import com.yach.smartquiz.request.ForgotPasswordRequest;
import com.yach.smartquiz.request.LoginUserRequest;
import com.yach.smartquiz.request.OAuthLoginRequest;
import com.yach.smartquiz.request.RegisterUserRequest;
import com.yach.smartquiz.response.LoginResponse;
import com.yach.smartquiz.service.AuthenticationService;
import com.yach.smartquiz.service.JwtService;
import com.yach.smartquiz.service.TokenService;
import com.yach.smartquiz.service.UserService;
import com.yach.smartquiz.request.ResetPasswordRequest;
import com.yach.smartquiz.request.ResetPasswordViaProfileRequest;
import com.yach.smartquiz.entity.Token;

@RequestMapping("/api/auth")
@RestController
public class AuthenticationController {

	private final JwtService jwtService;
	private final AuthenticationService authenticationService;
	private final UserService userService;
	private final TokenService tokenService;
	private final EmailProducer emailProducer;

	public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService,
			UserService userService, TokenService tokenService, EmailProducer emailProducer) {
		super();
		this.jwtService = jwtService;
		this.authenticationService = authenticationService;
		this.userService = userService;
		this.tokenService = tokenService;
		this.emailProducer = emailProducer;
	}

	@PostMapping("/signup")
	public ResponseEntity<User> register(@RequestBody RegisterUserRequest registerUserDto) {
		User registeredUser = authenticationService.signup(registerUserDto);
		return ResponseEntity.ok(registeredUser);
	}

	@PostMapping("/login")
	public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserRequest loginUserDto) {
		User authenticatedUser = authenticationService.authenticate(loginUserDto);
		String jwtToken = jwtService.generateToken(authenticatedUser);
		LoginResponse loginResponse = new LoginResponse(jwtToken, jwtService.getExpirationTime(),
				authenticatedUser.getEmail(), authenticatedUser.getUsername(), authenticatedUser.getRoles(),
				authenticatedUser.getExamTypes().size() == 0, authenticatedUser.getProfileImage());
		return ResponseEntity.ok(loginResponse);
	}

	@PostMapping("/oauth")
	public ResponseEntity<LoginResponse> loginWithOAuth(@RequestBody OAuthLoginRequest request) {
		String email = request.email();
		String name = request.name();
		String imageUrl = request.imageUrl();
		User user = Optional.ofNullable(userService.getUserByEmailForExam(email))
				.orElseGet(() -> authenticationService.handleOAuthAccountCreation(email, name, imageUrl));
		String jwtToken = jwtService.generateToken(user);
		LoginResponse response = new LoginResponse(jwtToken, jwtService.getExpirationTime(), user.getEmail(),
				user.getUsername(), user.getRoles(), user.getExamTypes().size() == 0, user.getProfileImage());
		return ResponseEntity.ok(response);
	}

	@PostMapping("/forgot-password")
	public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
		String email = request.email();
		User user = userService.getUserByEmail(email);
		if (user != null) {
			String token = tokenService.generateToken(user);
			emailProducer.sendForgotEmailMessage(new ForgotPasswordMessagingRequest(user, token));
			return ResponseEntity.ok("Mail sent successfully!");
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Mail sent failed!");
	}

	@PostMapping("/reset-password")
	public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
		String password = request.password();
		String token = request.token();
		Optional<Token> tokenObj = tokenService.findByToken(token);
		if (tokenObj.isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token!");
		}
		if (authenticationService.resetPassword(tokenObj.get().getUser(), password) == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token!");
		}
		tokenService.deleteAllTokenByUser(tokenObj.get().getUser());
		return ResponseEntity.ok("Password has been reset!");
	}

	@GetMapping("/validate-token/{token}")
	public ResponseEntity<String> validateToken(@PathVariable String token) {
		Optional<Token> validToken = tokenService.validateToken(token);
		if (validToken.isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token!");
		}
		return ResponseEntity.ok("The token is valid!");
	}
	
	@PostMapping("/change-password")
	public ResponseEntity<String> changePasswordViaProfile(@RequestBody ResetPasswordViaProfileRequest request) {
		String currentPassword = request.currentPassword();
		String newPassword = request.newPassword();
		String email = request.email();
		User authenticatedUser = authenticationService.authenticate(new LoginUserRequest(email, currentPassword));
		if (authenticatedUser != null) {
			User user = authenticationService.resetPassword(authenticatedUser, newPassword);
			if (user != null) {
				return ResponseEntity.ok("Password has been changed successfully!");
			} else {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to reset password");
			}
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed");
		}
	}

}
