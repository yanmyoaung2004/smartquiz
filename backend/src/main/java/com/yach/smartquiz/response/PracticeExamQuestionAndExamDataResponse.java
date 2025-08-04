package com.yach.smartquiz.response;

import java.util.List;

public record PracticeExamQuestionAndExamDataResponse(List<QuestionResponse> questions, String quizTitle, Integer allowedTime, String startTime) {

}
