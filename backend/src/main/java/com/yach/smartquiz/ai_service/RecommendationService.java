package com.yach.smartquiz.ai_service;

import java.util.Map;

public interface RecommendationService {

	public boolean getPrediction(Map<String, Object> features);
}
