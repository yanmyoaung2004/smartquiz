package com.yach.smartquiz.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.yach.smartquiz.custom_exception.NotFoundException;
import com.yach.smartquiz.entity.User;
import com.yach.smartquiz.repository.UserRepository;
import com.yach.smartquiz.service.UserService;

@Service
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;

	public UserServiceImpl(UserRepository userRepository) {
		super();
		this.userRepository = userRepository;
	}
	
	@Override
	public List<User> getAllUserForAdmin() {
		return userRepository.findAll();
	}

	@Override
	public User createUser(User user) {
		return userRepository.save(user);
	}
	
	@Override
	public User updateUser(User user) {
		return userRepository.save(user);
	}

	@Override
	public User getUserByEmail(String email) {
		Optional<User> userOpt = userRepository.findByEmail(email);
		if(userOpt.isEmpty()){
			throw new NotFoundException("User Not Found");
		}
		return userOpt.get();
	}

	@Override
	public User getUserById(Long id) {
		Optional<User> userOpt = userRepository.findById(id);
		if(userOpt.isEmpty()) {
			throw new NotFoundException("User Not Found!");
		}
		return userOpt.get();
	}
	
	@Override
	public User getUserByEmailForExam(String email) {
		Optional<User> userOpt = userRepository.findByEmail(email);
		if(userOpt.isEmpty()){
			return null;
		}
		return userOpt.get();
	}
}
