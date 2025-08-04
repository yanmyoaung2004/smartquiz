package com.yach.smartquiz.response;

import java.util.List;

public record QuestionResponse(Long id, String type, boolean hasImage, String imageUrl, String imageAlt,
		String question, String explanation, List<OptionResponse> options) {

}
