package com.yach.smartquiz.request;

import java.util.List;

public record PracticeExamCreateRequest(List<Long> topicList, List<String> yearList, Integer numberOfQuestions, Boolean isOptionRandom, Integer duration) {

}
