package com.yach.smartquiz.service;

import java.time.LocalDateTime;
import java.util.List;


import com.yach.smartquiz.entity.PracticeExam;
import com.yach.smartquiz.entity.Question;
import com.yach.smartquiz.entity.UserAnswer;
import com.yach.smartquiz.entity.UserExam;
import com.yach.smartquiz.entity.UserTopicPerformanceDTO;
import com.yach.smartquiz.entity.UserTopicPerformanceForRecommendationDTO;

public interface UserAnswerService {

	UserAnswer createUserAnswer(UserAnswer userAnswer);

	List<UserAnswer> getCorrectAnswersByPracticeExam(PracticeExam practiceExam);

	List<UserAnswer> getAnswersWithQuestionAndOptionsByPracticeExam(PracticeExam practiceExam);

	List<UserAnswer> getAnswersWithQuestionAndOptionsByUserExam(UserExam userExam);

	List<UserAnswer> getUserAnswerByUserExam(UserExam userExam);

	UserAnswer getByUserExamAndQuestion(UserExam userExam, Question question);

	List<UserTopicPerformanceDTO> getUserTopicPerformance(Long userId, Long questionTypeId);

	Double getCurrentOverallScore(Long userId);

	Double getPreviousMonthOverallScore(Long userId, LocalDateTime startOfThisMonth);
	
	List<UserTopicPerformanceForRecommendationDTO> findUserTopicPerformanceForRecommendation(Long userId, Long questionTypeId);

}
