package com.yach.smartquiz.response;

public record RemoveNotificationResponse(Long notificationId, Long examId, String status, String permissionStatus) {

}
