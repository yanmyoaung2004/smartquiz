package com.yach.smartquiz.service;

import com.yach.smartquiz.entity.RoleRequest;
import com.yach.smartquiz.entity.User;

import java.util.List;
import java.util.Optional;

public interface RoleRequestService {
	RoleRequest createRoleRequest(RoleRequest roleRequest);

	RoleRequest updateRoleRequest(Long id, RoleRequest updatedRequest);

	Optional<RoleRequest> getRoleRequestById(Long id);

	List<RoleRequest> getAllRoleRequests();

	void deleteRoleRequest(Long id);

	Optional<RoleRequest> findByUserAndRoleName(User user, String roleName);

}
