package com.yach.smartquiz.response;

public record TopicListResponse(Long id, String name, String description, int numberOfQuestions, Chapter chapter) {

	public record Chapter(Long id, String name) {
		
	}
}

