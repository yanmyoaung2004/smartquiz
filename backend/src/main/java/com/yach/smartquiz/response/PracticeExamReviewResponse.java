package com.yach.smartquiz.response;

import java.util.List;

public record PracticeExamReviewResponse(String examTitle, Integer score, Integer totalQuestions,
		Integer correctAnswers, Integer timeTaken, String completionTime, List<QuestionReviewResponse> questions) {

}
