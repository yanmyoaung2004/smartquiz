package com.yach.smartquiz.response;

import com.yach.smartquiz.entity.ScoreDistribution;

import java.util.List;
import java.util.Map;

public record ExamDetailResponse(List<ScoreDistribution> scoreDistribution, Map<String, Object> timeAnalysis,
		List<ExamResultStudent> studentResultLists, List<QuestionAnalytics> questionAnalytics) {

}
