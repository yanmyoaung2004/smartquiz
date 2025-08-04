package com.yach.smartquiz.response;

public record PracticeHistoryListResponse(Long practiceId, String examCode, String topicList, Integer score, String date, String status) {
}
