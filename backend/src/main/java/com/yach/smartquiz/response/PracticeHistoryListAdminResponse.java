package com.yach.smartquiz.response;

public record PracticeHistoryListAdminResponse(Long practiceId, String examCode,
		String topicList, Integer score, String date, String status, String name, Long userId, String imageUrl) {

}
