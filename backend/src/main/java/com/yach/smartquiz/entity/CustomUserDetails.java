package com.yach.smartquiz.entity;

import org.springframework.security.core.userdetails.UserDetails;

public interface CustomUserDetails extends UserDetails {

	String getEmail();

	Long getId();

	String getName();

}

