package com.yach.smartquiz.service.impl;

import com.yach.smartquiz.entity.RoleRequest;
import com.yach.smartquiz.entity.User;
import com.yach.smartquiz.repository.RoleRequestRepository;
import com.yach.smartquiz.service.RoleRequestService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoleRequestServiceImpl implements RoleRequestService {

	private final RoleRequestRepository roleRequestRepository;

	public RoleRequestServiceImpl(RoleRequestRepository roleRequestRepository) {
		this.roleRequestRepository = roleRequestRepository;
	}

	@Override
	public RoleRequest createRoleRequest(RoleRequest roleRequest) {
		return roleRequestRepository.save(roleRequest);
	}

	@Override
	public RoleRequest updateRoleRequest(Long id, RoleRequest updatedRequest) {
		return roleRequestRepository.findById(id).map(existing -> {
			existing.setUser(updatedRequest.getUser());
			existing.setRole(updatedRequest.getRole());
			existing.setStatus(updatedRequest.getStatus());
			return roleRequestRepository.save(existing);
		}).orElseThrow(() -> new RuntimeException("RoleRequest not found with id: " + id));
	}

	@Override
	public Optional<RoleRequest> getRoleRequestById(Long id) {
		return roleRequestRepository.findById(id);
	}

	@Override
	public List<RoleRequest> getAllRoleRequests() {
		return roleRequestRepository.findAll();
	}

	@Override
	public void deleteRoleRequest(Long id) {
		roleRequestRepository.deleteById(id);
	}

	@Override
	public Optional<RoleRequest> findByUserAndRoleName(User user, String roleName) {
		return roleRequestRepository.findByUserAndRole_Name(user, roleName);
	}
}
