package com.yach.smartquiz.entity;

public interface UserTopicPerformanceForRecommendationDTO {
    Long getTopicId();
    String getTopicName();
    Long getUserId();
    Long getTotalQuestions();
    Long getCorrectCount();
    Double getLastScore();
    Integer getNumAttempts();
}


