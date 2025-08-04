package com.yach.smartquiz.request;

public record ExamCredentials(Long id, String title, String description, Integer passingScore, Integer maxAttempts,
		String examCode, String startDateTime, String endDateTime, Integer allowedTime, boolean isRandom) {
}
