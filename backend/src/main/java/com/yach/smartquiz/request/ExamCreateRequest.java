package com.yach.smartquiz.request;

import java.util.List;

public record ExamCreateRequest(ExamCredentials examCredentials, List<Long> questionList) {

}

