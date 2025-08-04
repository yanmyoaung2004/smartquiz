package com.yach.smartquiz.service;

import com.yach.smartquiz.response.NotificationListResponse;

public interface NotificationService {

	void sendInvitateNotificationToEmail(String invitedUserEmail, NotificationListResponse newNotification);

	void removeInviteNotificationToEmail(String invitedUserEmail, Long notePermissionId, Long examId,
			String permissionStatus);

}
