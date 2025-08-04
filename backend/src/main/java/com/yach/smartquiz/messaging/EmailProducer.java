package com.yach.smartquiz.messaging;

import com.yach.smartquiz.entity.User;

public interface EmailProducer {
	
	void sendForgotEmailMessage(ForgotPasswordMessagingRequest request);
	
	void handleExamInvitationEmail(ExamInvitationMessagingRequest request);
	
	void handleAcceptTeacherEmail(User user);
	
}
