package com.yach.smartquiz.response;

import java.util.List;

import com.yach.smartquiz.entity.QuestionType;

public record ProfileSubjectRequest(List<QuestionType> subjectList, QuestionType selectedSubject) {

}
