package com.yach.smartquiz.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

	@Bean
	Jackson2JsonMessageConverter messageConverter() {
		return new Jackson2JsonMessageConverter();
	}

	@Bean
	Queue forgotEmailQueue() {
		return new Queue("forgotEmailQueue", true);
	}
	
	@Bean
	Queue teacherAcceptQueue() {
		return new Queue("teacherAcceptQueue", true);
	}

	@Bean
	Queue examInvitationQueue() {
		return new Queue("examInvitationQueue", true);
	}

}
