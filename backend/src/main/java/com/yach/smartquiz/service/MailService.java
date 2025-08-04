package com.yach.smartquiz.service;

import com.yach.smartquiz.entity.User;

public interface MailService {

	void sendForgotPasswordEmail(String token, User user);

	void sendExamInvitationEmail(String email, String examCode, String examName, String deadLine);

	void sendTeacherApplicationAcceptedEmail(User user);

}
