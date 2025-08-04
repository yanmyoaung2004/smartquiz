package com.yach.smartquiz.request;

public record UserExamListResponse(Long id, String name, String description, Integer numberOfQuestions,
		Integer duration, String examCode, String creator, boolean taken) {

}