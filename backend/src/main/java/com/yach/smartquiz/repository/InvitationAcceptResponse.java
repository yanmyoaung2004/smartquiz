package com.yach.smartquiz.repository;

public record InvitationAcceptResponse(String examCode, String email, Boolean isUserExisted) {

}
