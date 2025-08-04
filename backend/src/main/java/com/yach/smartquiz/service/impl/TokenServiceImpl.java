package com.yach.smartquiz.service.impl;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.yach.smartquiz.entity.Token;
import com.yach.smartquiz.entity.User;
import com.yach.smartquiz.repository.TokenRepository;
import com.yach.smartquiz.service.TokenService;

import jakarta.transaction.Transactional;

@Service
public class TokenServiceImpl implements TokenService {

	private final TokenRepository tokenRepository;

	public TokenServiceImpl(TokenRepository tokenRepository) {
		super();
		this.tokenRepository = tokenRepository;
	}

	@Override
	public String generateToken(User user) {
		String tokenString = UUID.randomUUID().toString();
		LocalDateTime createdAt = LocalDateTime.now();
		LocalDateTime expiresAt = createdAt.plusMinutes(30);
		Token token = new Token(user, tokenString, createdAt, expiresAt);
		tokenRepository.save(token);
		return tokenString;
	}

	@Override
	public Optional<Token> validateToken(String token) {
		return tokenRepository.findByTokenAndExpiresAtAfter(token, LocalDateTime.now());
	}

	@Override
	public Optional<Token> findByToken(String token) {
		return tokenRepository.findByToken(token);
	}

	@Transactional
	@Override
	public void deleteAllTokenByUser(User user) {
		tokenRepository.deleteAllByUser(user);
	}
	
	

}
