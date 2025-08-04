package com.yach.smartquiz.messaging;


public record ExamInvitationMessagingRequest(String email, String examCode, String examName, String deadLine) {

}
