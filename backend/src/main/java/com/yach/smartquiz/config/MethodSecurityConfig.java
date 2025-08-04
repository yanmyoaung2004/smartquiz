package com.yach.smartquiz.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@EnableMethodSecurity(
	    prePostEnabled = true,   // for @PreAuthorize / @PostAuthorize
	    securedEnabled   = true, // for @Secured
	    jsr250Enabled    = true  // for @RolesAllowed
	)

@Configuration
public class MethodSecurityConfig {
}
