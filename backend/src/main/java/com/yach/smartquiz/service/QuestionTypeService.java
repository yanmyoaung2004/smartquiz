package com.yach.smartquiz.service;

import java.util.List;

import com.yach.smartquiz.entity.QuestionType;

public interface QuestionTypeService {

	QuestionType createQuestionType(QuestionType questionType);

	QuestionType updateQuestionType(QuestionType questionType);

    void deleteQuestionTypeById(Long id);

    QuestionType getQuestionTypeById(Long id);

    List<QuestionType> getAllQuestionTypes();
}
