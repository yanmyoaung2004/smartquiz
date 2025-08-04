package com.yach.smartquiz.service.impl;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.yach.smartquiz.custom_exception.AlreadyExistedException;
import com.yach.smartquiz.custom_exception.NotFoundException;
import com.yach.smartquiz.entity.Role;
import com.yach.smartquiz.entity.User;
import com.yach.smartquiz.entity.UserSettings;
import com.yach.smartquiz.repository.UserRepository;
import com.yach.smartquiz.request.LoginUserRequest;
import com.yach.smartquiz.request.RegisterUserRequest;
import com.yach.smartquiz.service.AuthenticationService;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	private final Role defaultRole;

	public AuthenticationServiceImpl(UserRepository userRepository, AuthenticationManager authenticationManager,
			PasswordEncoder passwordEncoder, @Qualifier("studentRole") Role defaultRole) {
		this.authenticationManager = authenticationManager;
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.defaultRole = defaultRole;

	}

	@Override
	public User signup(RegisterUserRequest input) {
		Optional<User> userOptional = userRepository.findByEmail(input.email());
		if (userOptional.isPresent()) {
			throw new AlreadyExistedException("User already existed with email : " + input.email());
		}
		String encodedPassword = passwordEncoder.encode(input.password());
		User user = new User(input.username(), input.email(), encodedPassword);
		user.setUserSettings(new UserSettings(user));
		user.getRoles().add(defaultRole);
		return userRepository.save(user);
	}

	@Override
	public User authenticate(LoginUserRequest input) {
		Optional<User> user = userRepository.findByEmail(input.email());
		if (user.isEmpty()) {
			throw new NotFoundException("User Not Found : " + input.email());
		}
		Authentication authentication = authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(input.email().trim(), input.password().trim()));
		SecurityContextHolder.getContext().setAuthentication(authentication);
		return user.get();
	}

	@Override
	public User resetPassword(User user, String password) {
		String encodedPassword = passwordEncoder.encode(password);
		user.setPassword(encodedPassword);
		return userRepository.save(user);
	}
	
	@Override
	public User handleOAuthAccountCreation(String email, String name, String imageUrl) {
		String generatedPassword = generateRandomPassword();
        String hashedPassword = passwordEncoder.encode(generatedPassword);
        User user = new User();
        user.setUsername(name.toLowerCase().replaceAll(" ", "") + getRandomDigits(4));
        user.setEmail(email);
        user.setPassword(hashedPassword);
        user.setProfileImage(imageUrl);
        user.setUserSettings(new UserSettings(user));
		user.getRoles().add(defaultRole);
        return userRepository.save(user);

	}
	
	private String generateRandomPassword() {
		return UUID.randomUUID().toString().replace("-", "").substring(0, 8)
				+ UUID.randomUUID().toString().replace("-", "").substring(0, 8);
	}

	private String getRandomDigits(int length) {
		return String.valueOf((int) (Math.random() * Math.pow(10, length)));
	}
}