package com.yach.smartquiz.request;
import java.util.Map;

public record SubmitExamRequest(String examCode, Map<Long, Long> questionAnswerList, String email) {

}
