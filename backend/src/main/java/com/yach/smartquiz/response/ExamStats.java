package com.yach.smartquiz.response;

import java.math.BigDecimal;

public record ExamStats(Integer totalParticipants,Integer totalCompleted, Integer completedAttempts, Integer averageScore, Integer passRate,
		BigDecimal averageTime) {

}
