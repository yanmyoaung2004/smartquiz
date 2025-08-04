package com.yach.smartquiz.service;

import com.yach.smartquiz.entity.Permission;

public interface PermissionService {

	Permission createPermission(Permission permission);

	Permission getPermissionByName(String name);

}
