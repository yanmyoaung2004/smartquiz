package com.yach.smartquiz.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.yach.smartquiz.custom_exception.NotFoundException;
import com.yach.smartquiz.entity.Exam;
import com.yach.smartquiz.entity.ExamInvitation;
import com.yach.smartquiz.entity.User;
import com.yach.smartquiz.entity.UserExam;
import com.yach.smartquiz.repository.UserExamRepository;
import com.yach.smartquiz.service.UserExamService;

@Service
public class UserExamServiceImpl implements UserExamService {

	private final UserExamRepository userExamRepository;

	@Override
	public List<UserExam> getUserExam() {
		return userExamRepository.findAll();
	}

	public UserExamServiceImpl(UserExamRepository userExamRepository) {
		super();
		this.userExamRepository = userExamRepository;
	}

	@Override
	public List<UserExam> getUserExamByUser(User user) {
		return userExamRepository.findByUser(user);
	}

	@Override
	public UserExam createUserExam(UserExam userExam) {
		return userExamRepository.save(userExam);
	}

	public UserExam saveUserExam(UserExam userExam) {
		Optional<UserExam> existingOpt = userExamRepository.findById(userExam.getId());
		if (existingOpt.isEmpty()) {
			throw new NotFoundException("User Exam Not Found!");
		}
		UserExam existing = existingOpt.get();
		existing.setScore(userExam.getScore());
		existing.setSubmittedAt(userExam.getSubmittedAt());

		return userExamRepository.save(existing);
	}

	@Override
	public boolean existsByUserAndExam(User user, Exam exam) {
		return userExamRepository.existsByUserAndExam(user, exam);
	}

	@Override
	public UserExam getUserExamByUserAndExam(User user, Exam exam) {
		Optional<UserExam> userExamOpt = userExamRepository.findByUserAndExam(user, exam);
		if (userExamOpt.isEmpty()) {
			return null;
		}
		return userExamOpt.get();
	}

	@Override
	public UserExam getUserExamByGuestUserAndExam(ExamInvitation guestUser, Exam exam) {
		Optional<UserExam> userExamOpt = userExamRepository.findByGuestUserAndExam(guestUser, exam);
		if (userExamOpt.isEmpty()) {
			return null;
		}
		return userExamOpt.get();
	}

	@Override
	public List<UserExam> getAllUserExamByExam(Exam exam) {
		return userExamRepository.findByExamOrderByIdDesc(exam);
	}

}
