package com.yach.smartquiz.service;

import java.util.List;

import com.yach.smartquiz.response.ExamListResponse;

public interface ExamCacheService {

	 List<ExamListResponse> getFormattedExamListResponse();
}
