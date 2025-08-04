package com.yach.smartquiz.config;

import java.security.Principal;
import java.util.Map;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import com.yach.smartquiz.entity.CustomUserDetails;

public class EmailPrincipalHandshakeHandler extends DefaultHandshakeHandler {

	@Override
	protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler,
			Map<String, Object> attributes) {
		CustomUserDetails userDetails = (CustomUserDetails) attributes.get("user");
		return () -> userDetails.getEmail();

	}
}
