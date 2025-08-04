package com.yach.smartquiz.response;

public record ExamCreateResponse(Long id, String title, String description, String examCode, String startDate,
		Integer numberOfQuestions, Integer duration) {

}
