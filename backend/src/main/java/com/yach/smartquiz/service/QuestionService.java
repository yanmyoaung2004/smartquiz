package com.yach.smartquiz.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.yach.smartquiz.entity.Chapter;
import com.yach.smartquiz.entity.Question;
import com.yach.smartquiz.entity.QuestionStatus;
import com.yach.smartquiz.entity.QuestionType;
import com.yach.smartquiz.entity.Topic;
import com.yach.smartquiz.entity.User;

@Service
public interface QuestionService {

	Question createQuestion(Question question, int correctOptionIndex);
	
	List<Question> createQuestionWithImport(List<Question> questions);

	Question updateQuestion(Question question);

	List<Question> getAllQuestions();

	List<Question> getAllQuestionsByStatus(QuestionStatus status, QuestionType questionType);

	List<Question> findQuestions(QuestionStatus status, QuestionType questionType, User user);

	Long getAllQuestionsCountByStatus(QuestionStatus status, QuestionType questionType);

	List<Question> getByQuestionTextOrTopicNameContainingIgnoreCase(String keyword);

	List<Question> searchByQuestionTextOrTopicNameAndStatus(String keyword, QuestionStatus status);

	Question getQuestionById(Long id);

	void deleteQuestionById(Long id);

	List<Question> getAllQuestionByTopic(Topic topic);

	List<Question> findByStatusAndCreatedBy(QuestionStatus status, User createdBy);

	Long findCountByStatusAndCreatedBy(QuestionStatus status, User createdBy, QuestionType questionType);

	List<Question> searchByCreatedByAndKeyword(String keyword, User createdBy);

	Long countByCreatedBy(User createdBy, QuestionType questionType);

	List<Question> getByCreatedBy(User createdBy);

	List<Question> getQuestionsWithImages();

	List<Question> getQuestionsWithImagesByKeyword(String keyword);

	List<Question> getFilteredQuestions(Topic topic, Chapter chapter, String year, String keyword, Boolean isMine,
			User user);

}
