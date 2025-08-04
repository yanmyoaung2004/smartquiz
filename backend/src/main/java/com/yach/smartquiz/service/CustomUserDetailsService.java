package com.yach.smartquiz.service;

import org.springframework.security.core.userdetails.UserDetailsService;

import com.yach.smartquiz.custom_exception.NotFoundException;
import com.yach.smartquiz.entity.CustomUserDetails;



public interface CustomUserDetailsService extends UserDetailsService {

	public CustomUserDetails loadUserByEmail(String email) throws NotFoundException;

}
