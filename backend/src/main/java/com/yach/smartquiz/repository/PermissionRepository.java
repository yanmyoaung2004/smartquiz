package com.yach.smartquiz.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yach.smartquiz.entity.Permission;

public interface PermissionRepository extends JpaRepository<Permission, Long> {

	Optional<Permission> findByName(String name);
	
}