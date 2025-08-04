package com.yach.smartquiz.response;

import java.util.List;

public record QuestionAnalytics(Long questionId, String question, String topic, Integer totalAttempts,
		Integer correctAttempts, Integer successRate, List<CommonWrongAnswers> commonWrongAnswers) {

}
