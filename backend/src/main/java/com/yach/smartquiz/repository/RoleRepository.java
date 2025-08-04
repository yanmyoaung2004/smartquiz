package com.yach.smartquiz.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yach.smartquiz.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
	boolean existsByName(String name);

	Role findByNameIgnoreCase(String name);
}
