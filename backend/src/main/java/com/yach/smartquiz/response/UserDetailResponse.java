package com.yach.smartquiz.response;

public record UserDetailResponse(Long id, String email, String username, String imageUrl, boolean emailNoti, boolean reminderNoti) {

}
