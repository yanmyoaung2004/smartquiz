package com.yach.smartquiz.request;

import com.yach.smartquiz.entity.Question;

public record CreateQuestionRequest(int correctOptionIndex, Question question, Long topicId, Long typeId) {

}
