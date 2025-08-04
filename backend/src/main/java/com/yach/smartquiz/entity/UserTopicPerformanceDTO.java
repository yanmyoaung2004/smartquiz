package com.yach.smartquiz.entity;

public interface UserTopicPerformanceDTO {

	Long getTopicId();

	String getTopicName();

	Long getUserId();

	Long getTotalQuestions();

	Long getCorrectCount();

	Double getPerformanceScore();
}
