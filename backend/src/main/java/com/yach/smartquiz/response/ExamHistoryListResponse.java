package com.yach.smartquiz.response;

public record ExamHistoryListResponse(Long examId, String examCode, String title, Integer score, String date, Integer duration,
		String status) {
}
