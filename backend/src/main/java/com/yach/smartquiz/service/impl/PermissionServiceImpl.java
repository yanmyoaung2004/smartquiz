package com.yach.smartquiz.service.impl;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.yach.smartquiz.entity.Permission;
import com.yach.smartquiz.repository.PermissionRepository;
import com.yach.smartquiz.service.PermissionService;

@Service
public class PermissionServiceImpl implements PermissionService {

	private final PermissionRepository permissionRepository;

	public PermissionServiceImpl(PermissionRepository permissionRepository) {
		super();
		this.permissionRepository = permissionRepository;
	}

	@Override
	public Permission createPermission(Permission permission) {

		return permissionRepository.save(permission);
	}

	@Override
	public Permission getPermissionByName(String name) {
		Optional<Permission> permissionOpt = permissionRepository.findByName(name);
		if (permissionOpt.isEmpty()) {
			return null;
		}

		return permissionOpt.get();
	}
}
