package com.yach.smartquiz.service.impl;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.yach.smartquiz.custom_exception.NotFoundException;
import com.yach.smartquiz.entity.CustomUserDetails;
import com.yach.smartquiz.repository.UserRepository;
import com.yach.smartquiz.service.CustomUserDetailsService;



@Service
public class CustomUserDetailsServiceImpl implements CustomUserDetailsService {

	private final UserRepository userRepository;

	public CustomUserDetailsServiceImpl(UserRepository userRepository) {
		super();
		this.userRepository = userRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws NotFoundException {
		return userRepository.findByUsername(username)
				.orElseThrow(() -> new NotFoundException("User not found: " + username));
	}

	@Override
	public CustomUserDetails loadUserByEmail(String email) throws NotFoundException {
		return userRepository.findByEmail(email)
				.orElseThrow(() -> new NotFoundException("User not found with email: " + email));
	}

}
