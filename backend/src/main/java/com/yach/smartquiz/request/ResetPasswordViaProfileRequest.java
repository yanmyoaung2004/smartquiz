package com.yach.smartquiz.request;

public record ResetPasswordViaProfileRequest(String currentPassword, String newPassword, String email) {

}
