package com.yach.smartquiz.response;

import java.util.Set;

import com.yach.smartquiz.entity.Role;

public record LoginResponse(String token, long expiresIn, String email, String username, Set<Role> role,
		boolean isSetupRequired, String profileImage) {

}
