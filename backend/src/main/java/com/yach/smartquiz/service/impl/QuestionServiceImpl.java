package com.yach.smartquiz.service.impl;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yach.smartquiz.custom_exception.NotFoundException;
import com.yach.smartquiz.entity.Chapter;
import com.yach.smartquiz.entity.Option;
import com.yach.smartquiz.entity.Question;
import com.yach.smartquiz.entity.QuestionStatus;
import com.yach.smartquiz.entity.QuestionType;
import com.yach.smartquiz.entity.Topic;
import com.yach.smartquiz.entity.User;
import com.yach.smartquiz.repository.QuestionRepository;
import com.yach.smartquiz.service.QuestionService;
import com.yach.smartquiz.specification.QuestionSpecification;

import jakarta.transaction.Transactional;

@Service
public class QuestionServiceImpl implements QuestionService {

	@Autowired
	private QuestionRepository questionRepository;

	@Override
	public Question createQuestion(Question question, int correctOptionIndex) {
		List<Option> options = question.getOptions();
		for (int i = 0; i < options.size(); i++) {
			Option option = options.get(i);
			option.setQuestion(question);
			if (option.getImageUrl() == "") {
				option.setImageUrl(null);
			}
			if (i == correctOptionIndex) {
				question.setCorrectOption(option);
			}
		}
		return questionRepository.save(question);
	}

	@Transactional
	@Override
	public List<Question> createQuestionWithImport(List<Question> questions) {
		questions.forEach(q -> q.getOptions().forEach(o -> o.setQuestion(q)));
		return (List<Question>) questionRepository.saveAll(questions);
	}

	@Override
	public List<Question> getQuestionsWithImages() {
		return ((Collection<Question>) questionRepository.findAll()).stream()
				.filter(q -> (q.getImageUrl() != null && !q.getImageUrl().isEmpty())
						|| q.getOptions().stream().anyMatch(o -> o.getImageUrl() != null && !o.getImageUrl().isEmpty()))
				.collect(Collectors.toList());
	}

	public List<Question> getQuestionsWithImagesByKeyword(String keyword) {
		return ((Collection<Question>) questionRepository.findAll()).stream()
				.filter(q -> ((q.getImageUrl() != null && !q.getImageUrl().isEmpty())
						|| q.getOptions().stream().anyMatch(o -> o.getImageUrl() != null && !o.getImageUrl().isEmpty()))
						&& (q.getQuestionText().toLowerCase().contains(keyword.toLowerCase()) || (q.getTopic() != null
								&& q.getTopic().getName().toLowerCase().contains(keyword.toLowerCase()))))
				.collect(Collectors.toList());
	}

	@Override
	public List<Question> getFilteredQuestions(Topic topic, Chapter chapter, String year, String keyword,
			Boolean isMine, User user) {
		List<Question> questions = questionRepository.findAll(
				QuestionSpecification.filterByTopicChapterYearKeyword(topic, chapter, year, keyword, isMine, user));
		System.out.println(questions.size());
		return questions;
	}

	@Override
	public List<Question> getByCreatedBy(User createdBy) {
		return questionRepository.findByCreatedBy(createdBy);
	}

	@Override
	public List<Question> searchByCreatedByAndKeyword(String keyword, User createdBy) {
		return questionRepository.searchByCreatedByAndKeyword(createdBy, keyword);
	}

	@Override
	public Long countByCreatedBy(User createdBy, QuestionType questionType) {
		return questionRepository.countByCreatedByAndTopic_Chapter_Type(createdBy, questionType);
	}

	@Override
	public Long findCountByStatusAndCreatedBy(QuestionStatus status, User createdBy, QuestionType questionType) {
		return questionRepository.countByStatusAndCreatedByAndTopic_Chapter_Type(status, createdBy, questionType);
	}

	@Override
	public Long getAllQuestionsCountByStatus(QuestionStatus status, QuestionType questionType) {
		return questionRepository.countByStatusAndTopic_Chapter_Type(status, questionType);
	}

	@Override
	public List<Question> findByStatusAndCreatedBy(QuestionStatus status, User createdBy) {
		return questionRepository.findByStatusAndCreatedBy(status, createdBy);
	}

	@Override
	public Question updateQuestion(Question question) {
		return questionRepository.save(question);
	}

	@Override
	public void deleteQuestionById(Long id) {
		Optional<Question> questionOptional = questionRepository.findById(id);
		if (questionOptional.isEmpty()) {
			throw new NotFoundException("Question not Found");
		}

		questionRepository.deleteById(id);
	}

	@Override
	public List<Question> getAllQuestions() {
		Optional<List<Question>> questionListOptional = Optional.of((List<Question>) questionRepository.findAll());
		if (questionListOptional.isEmpty()) {
			throw new NotFoundException("No Questions Found");
		}
		return questionListOptional.get();
	}

	@Override
	public List<Question> getAllQuestionsByStatus(QuestionStatus status, QuestionType questionType) {
		return questionRepository.findByStatusAndTopic_Chapter_Type(status, questionType);
	}

	@Override
	public List<Question> findQuestions(QuestionStatus status, QuestionType questionType, User user) {
		return questionRepository.findVisibleQuestions(questionType, user, status);
	}

	@Override
	public List<Question> getByQuestionTextOrTopicNameContainingIgnoreCase(String keyword) {
		return questionRepository.findByQuestionTextOrTopicNameContainingIgnoreCase(keyword);
	}

	@Override
	public List<Question> searchByQuestionTextOrTopicNameAndStatus(String keyword, QuestionStatus status) {
		return searchByQuestionTextOrTopicNameAndStatus(keyword, status);
	}

	@Override
	public Question getQuestionById(Long id) {
		Optional<Question> questionOptional = questionRepository.findById(id);
		if (questionOptional.isEmpty()) {
			throw new NotFoundException("Question not found with id: " + id);
		}
		return questionOptional.get();
	}

	@Override
	public List<Question> getAllQuestionByTopic(Topic topic) {
		return questionRepository.findAllQuestionsByTopic(topic);
	}

}
