package com.yach.smartquiz.messaging;

import com.yach.smartquiz.entity.User;

public record ForgotPasswordMessagingRequest(User user, String token) {

}
