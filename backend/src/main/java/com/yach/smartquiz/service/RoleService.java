package com.yach.smartquiz.service;

import java.util.List;

import com.yach.smartquiz.entity.Role;

public interface RoleService {

	Role createRole(Role role);

	Role updateRole(Role role);

	void deleteRoleById(Long id);

	Role getRoleById(Long id);

	List<Role> getAllRoles();
	
	boolean existsByName(String name);
	
	Role getRoleByName(String name);
}
