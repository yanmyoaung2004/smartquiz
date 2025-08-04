package com.yach.smartquiz.service.impl;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.yach.smartquiz.entity.NotificationStatus;
import com.yach.smartquiz.response.InviteNotificationResponse;
import com.yach.smartquiz.response.NotificationListResponse;
import com.yach.smartquiz.response.RemoveNotificationResponse;
import com.yach.smartquiz.service.NotificationService;

@Service
public class NotificationServiceImpl implements NotificationService {

	private SimpMessagingTemplate messagingTemplate;

	public NotificationServiceImpl(SimpMessagingTemplate messagingTemplate) {
		this.messagingTemplate = messagingTemplate;
	}

	@Override
	public void sendInvitateNotificationToEmail(String invitedUserEmail, NotificationListResponse newNotification) {
		messagingTemplate.convertAndSendToUser(invitedUserEmail, "/queue/invitations",
				new InviteNotificationResponse(newNotification, NotificationStatus.INVITE.toString()));
	}

	@Override
	public void removeInviteNotificationToEmail(String invitedUserEmail, Long notePermissionId, Long examId,
			String permissionStatus) {
		System.out.println("send");
		messagingTemplate.convertAndSendToUser(invitedUserEmail, "/queue/invitations", new RemoveNotificationResponse(
				notePermissionId, examId, NotificationStatus.DELETE.toString(), permissionStatus));
	}

}
