package com.yach.smartquiz.response;

import java.util.List;

public record QuestionReviewResponse(Long id, boolean hasImage, String imageUrl, String imageAlt,
		String question, String explanation, Long userAnswer, Long correctAnswer, Boolean isCorrect,
		List<OptionResponse> options) {

}
