package com.yach.smartquiz.response;

import java.util.List;

public record ExamListResponse(Long id, String creatorEmail, String examCode, String title, String description,
		String status, Integer totalQuestions, Integer duration, Integer passingScore, String startDate, String endDate,
		String createdAt, String lastModified, String subject, Integer maxAttempts, Boolean isRandomized,
		Boolean hasTimeLimit, ExamStats examStats, List<String> invitedEmail, boolean isPublic

) {

}
