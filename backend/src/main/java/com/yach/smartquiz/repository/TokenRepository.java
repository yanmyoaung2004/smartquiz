package com.yach.smartquiz.repository;


import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.yach.smartquiz.entity.Token;
import com.yach.smartquiz.entity.User;

public interface TokenRepository extends JpaRepository<Token, Long> {

	Optional<Token> findByTokenAndExpiresAtAfter(String token, LocalDateTime currentTime);

	Optional<Token> findByToken(String token);

	@Modifying
	@Query("DELETE FROM Token t WHERE t.user = :user")
	void deleteAllByUser(@Param("user") User user);

}
