package com.yach.smartquiz.request;

public record UserUpdateRequest(Long id, String email, String username, String profileImage, Long qusetionType) {

}
