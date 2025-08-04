package com.yach.smartquiz.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.yach.smartquiz.entity.PracticeExam;
import com.yach.smartquiz.entity.Question;
import com.yach.smartquiz.entity.UserAnswer;
import com.yach.smartquiz.entity.UserExam;
import com.yach.smartquiz.entity.UserTopicPerformanceDTO;
import com.yach.smartquiz.entity.UserTopicPerformanceForRecommendationDTO;
import com.yach.smartquiz.repository.UserAnswerRepository;
import com.yach.smartquiz.service.UserAnswerService;

@Service
public class UserAnswerServiceImpl implements UserAnswerService {

	private final UserAnswerRepository userAnswerRepository;

	public UserAnswerServiceImpl(UserAnswerRepository userAnswerRepository) {
		this.userAnswerRepository = userAnswerRepository;
	}

	@Override
	public List<UserTopicPerformanceDTO> getUserTopicPerformance(Long userId, Long questionTypeId) {
		return userAnswerRepository.findUserTopicPerformance(userId, questionTypeId);
	}

	@Override
	public UserAnswer createUserAnswer(UserAnswer userAnswer) {
		return userAnswerRepository.save(userAnswer);
	}

	@Override
	public List<UserAnswer> getCorrectAnswersByPracticeExam(PracticeExam practiceExam) {
		return userAnswerRepository.findByPracticeExamAndIsCorrectTrue(practiceExam);
	}

	@Override
	public List<UserAnswer> getAnswersWithQuestionAndOptionsByPracticeExam(PracticeExam practiceExam) {
		return userAnswerRepository.findAnswersWithQuestionAndOptionsByPracticeExam(practiceExam);
	}

	@Override
	public List<UserAnswer> getAnswersWithQuestionAndOptionsByUserExam(UserExam userExam) {
		return userAnswerRepository.findAnswersWithQuestionAndOptionsByUserExam(userExam);
	}

	@Override
	public List<UserAnswer> getUserAnswerByUserExam(UserExam userExam) {
		return userAnswerRepository.findByUserExam(userExam);
	}

	@Override
	public UserAnswer getByUserExamAndQuestion(UserExam userExam, Question question) {
		Optional<UserAnswer> userAnswerOpt = userAnswerRepository.findByUserExamAndQuestion(userExam, question);
		if (userAnswerOpt.isEmpty()) {
			return null;
		}
		return userAnswerOpt.get();
	}

	@Override
	public Double getCurrentOverallScore(Long userId) {
		return userAnswerRepository.getCurrentOverallScore(userId);
	}

	@Override
	public Double getPreviousMonthOverallScore(Long userId, LocalDateTime startOfThisMonth) {
		return userAnswerRepository.getPreviousMonthOverallScore(userId, startOfThisMonth);
	}

	@Override
	public List<UserTopicPerformanceForRecommendationDTO> findUserTopicPerformanceForRecommendation(Long userId, Long questionTypeId) {
		return userAnswerRepository.findUserTopicPerformanceForRecommendation(userId, questionTypeId);
	}
}
