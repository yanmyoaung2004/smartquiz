package com.yach.smartquiz.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.yach.smartquiz.custom_exception.NotFoundException;
import com.yach.smartquiz.entity.QuestionType;
import com.yach.smartquiz.repository.QuestionTypeRepository;
import com.yach.smartquiz.service.QuestionTypeService;

@Service
public class QuestionTypeServiceImpl implements QuestionTypeService {

	private final QuestionTypeRepository questionTypeRepository;

	public QuestionTypeServiceImpl(QuestionTypeRepository questionTypeRepository) {
		super();
		this.questionTypeRepository = questionTypeRepository;
	}

	@Override
	public QuestionType createQuestionType(QuestionType questionType) {
		return questionTypeRepository.save(questionType);
	}

	@Override
	public QuestionType updateQuestionType(QuestionType questionType) {
		return questionTypeRepository.save(questionType);
	}

	@Override
	public void deleteQuestionTypeById(Long id) {
		Optional<QuestionType> questionTypeOpt = questionTypeRepository.findById(id);
		if (questionTypeOpt.isEmpty()) {
			throw new NotFoundException("QuestionType Not Found!");
		}
		questionTypeRepository.deleteById(id);

	}

	@Override
	public QuestionType getQuestionTypeById(Long id) {
		Optional<QuestionType> questionTypeOpt = questionTypeRepository.findById(id);
		if (questionTypeOpt.isEmpty()) {
			throw new NotFoundException("QuestionType Not Found!");
		}
		return questionTypeOpt.get();

	}

	@Override
	public List<QuestionType> getAllQuestionTypes() {
		return questionTypeRepository.findAll();
	}

}
