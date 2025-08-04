package com.yach.smartquiz.response;

public record NotificationListResponse(Long id, String title, String teacher, String subject, String startTime,
		String endTime, boolean read, int questions, int duration, String examCode) {
}
