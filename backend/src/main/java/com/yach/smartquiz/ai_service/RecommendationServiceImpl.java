package com.yach.smartquiz.ai_service;

import java.util.List;
import java.util.Map;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class RecommendationServiceImpl implements RecommendationService {

	private final RestTemplate restTemplate = new RestTemplate();

	public boolean getPrediction(Map<String, Object> requestBody) {
	    String url = "http://localhost:5000/predict";

	    HttpHeaders headers = new HttpHeaders();
	    headers.setContentType(MediaType.APPLICATION_JSON);
	    HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

	    try {
	        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

	        ObjectMapper objectMapper = new ObjectMapper();
	        List<Map<String, Object>> resultList = objectMapper.readValue(response.getBody(), new TypeReference<>() {});
	        
	        int prediction = ((Number) resultList.get(0).get("prediction")).intValue();
	        return prediction == 1;

	    } catch (Exception e) {
	        e.printStackTrace();
	        return false; 
	    }
	}

}
