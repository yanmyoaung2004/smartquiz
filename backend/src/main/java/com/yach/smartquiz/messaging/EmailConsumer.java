package com.yach.smartquiz.messaging;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import com.yach.smartquiz.entity.User;
import com.yach.smartquiz.service.MailService;

@Service
public class EmailConsumer {

	private final MailService mailService;

	public EmailConsumer(MailService mailService) {
		super();
		this.mailService = mailService;
	}

	@RabbitListener(queues = "forgotEmailQueue")
	public void handleForgotEmail(ForgotPasswordMessagingRequest request) {
		mailService.sendForgotPasswordEmail(request.token(), request.user());
	}

	@RabbitListener(queues = "examInvitationQueue")
	public void handleExamInvitationEmail(ExamInvitationMessagingRequest request) {
		mailService.sendExamInvitationEmail(request.email(), request.examCode(), request.examName(),
				request.deadLine());
	}
	
	@RabbitListener(queues = "teacherAcceptQueue")
	public void handleTeacherAccept(User teacher) {
		mailService.sendTeacherApplicationAcceptedEmail(teacher);
	}

}
