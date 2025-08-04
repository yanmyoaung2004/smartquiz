package com.yach.smartquiz.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.yach.smartquiz.custom_exception.NotFoundException;
import com.yach.smartquiz.entity.Role;
import com.yach.smartquiz.repository.RoleRepository;
import com.yach.smartquiz.service.RoleService;

@Service
public class RoleServiceImpl implements RoleService {

	private final RoleRepository roleRepository;

	public RoleServiceImpl(RoleRepository roleRepository) {
		super();
		this.roleRepository = roleRepository;
	}

	@Override
	public Role createRole(Role role) {
		return roleRepository.save(role);
	}

	@Override
	public Role updateRole(Role role) {
		return roleRepository.save(role);
	}

	@Override
	public void deleteRoleById(Long id) {
		Optional<Role> roleOptional = roleRepository.findById(id);
		if (roleOptional.isEmpty()) {
			throw new NotFoundException("Role Not Found");
		}
		roleRepository.deleteById(id);
	}

	@Override
	public Role getRoleById(Long id) {
		Optional<Role> roleOptional = roleRepository.findById(id);
		if (roleOptional.isEmpty()) {
			throw new NotFoundException("Role Not Found");
		}
		return roleOptional.get();
	}

	@Override
	public List<Role> getAllRoles() {
		return roleRepository.findAll();
	}

	@Override
	public boolean existsByName(String name) {
		return roleRepository.existsByName(name);
	}

	@Override
	public Role getRoleByName(String name) {
		Role role = roleRepository.findByNameIgnoreCase(name);
		return role;
	}

}
