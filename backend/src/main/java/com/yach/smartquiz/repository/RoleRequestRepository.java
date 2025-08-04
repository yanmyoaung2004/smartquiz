package com.yach.smartquiz.repository;

import com.yach.smartquiz.entity.RoleRequest;
import com.yach.smartquiz.entity.User;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRequestRepository extends JpaRepository<RoleRequest, Long> {

	List<RoleRequest> findByStatus(String status);

	Optional<RoleRequest> findByUserAndRole_Name(User user, String roleName);

}
