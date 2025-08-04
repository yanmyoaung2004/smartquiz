package com.yach.smartquiz.response;

import java.util.List;

public record QuestionListResponse(Long id, String creatorEmail, String status, String questionText, Boolean hasImage,
		String imageUrl, String chapter, String topic, String year, String createdAt, String lastUsed,
		String explanation, List<OptionResponse> options) {

}
