package com.yach.smartquiz.response;

public record ExamResultStudent(Long id, String name, String email, Integer score, Integer percentage,
		Double timeSpent, String status, Integer attempt, String submittedAt, Integer correctAnswers,
		Integer totalQuestions) {
}
