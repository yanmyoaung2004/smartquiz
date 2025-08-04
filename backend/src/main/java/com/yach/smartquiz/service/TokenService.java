package com.yach.smartquiz.service;

import java.util.Optional;

import com.yach.smartquiz.entity.Token;
import com.yach.smartquiz.entity.User;

public interface TokenService {

	String generateToken(User user);
	
	Optional<Token> validateToken(String token);
	
	Optional<Token> findByToken(String token);
	
	void deleteAllTokenByUser(User user);
}
