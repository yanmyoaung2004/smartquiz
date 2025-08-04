package com.yach.smartquiz.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yach.smartquiz.entity.User;


public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByEmail(String email);

	Optional<User> findByUsername(String name);
	
//	Optional<User> findByRole(Role role);

}
