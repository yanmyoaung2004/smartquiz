package com.yach.smartquiz.response;

import java.util.List;

public record ExamResultResponse(String examTitle, Integer score, Integer totalQuestions, Integer correctAnswers,
		Integer timeTaken, String completionTime, List<QuestionStats> questionStats) {

}
