package com.yach.smartquiz.response;

public record ExamCreationQuestionResponse(Long id, String title, String topic, String chapter, String year,
		boolean hasImage, boolean isOwn) {

}
