package com.yach.smartquiz.messaging;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import com.yach.smartquiz.entity.User;

@Service
public class EmailProducerImpl implements EmailProducer {

	private final RabbitTemplate rabbitTemplate;

	public EmailProducerImpl(RabbitTemplate rabbitTemplate) {
		super();
		this.rabbitTemplate = rabbitTemplate;
	}

	@Override
	public void sendForgotEmailMessage(ForgotPasswordMessagingRequest request) {
		rabbitTemplate.convertAndSend("forgotEmailQueue", request);
	}

	@Override
	public void handleExamInvitationEmail(ExamInvitationMessagingRequest request) {
		rabbitTemplate.convertAndSend("examInvitationQueue", request);

	}

	@Override
	public void handleAcceptTeacherEmail(User user) {
		rabbitTemplate.convertAndSend("teacherAcceptQueue", user);
	}

}
