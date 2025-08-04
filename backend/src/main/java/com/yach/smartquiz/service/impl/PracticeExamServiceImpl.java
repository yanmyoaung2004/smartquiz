package com.yach.smartquiz.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.yach.smartquiz.custom_exception.NotFoundException;
import com.yach.smartquiz.entity.PracticeExam;
import com.yach.smartquiz.entity.User;
import com.yach.smartquiz.repository.PracticeExamRepository;
import com.yach.smartquiz.service.PracticeExamService;

@Service
public class PracticeExamServiceImpl implements PracticeExamService {

	private final PracticeExamRepository practiceExamRepository;

	public PracticeExamServiceImpl(PracticeExamRepository practiceExamRepository) {
		super();
		this.practiceExamRepository = practiceExamRepository;
	}
	
	@Override
	public List<PracticeExam> getAll() {
		return practiceExamRepository.findAll();
	}
	
	@Override
	public List<PracticeExam> getByUser(User user) {
		return practiceExamRepository.findByUser(user);
	}

	@Override
	public PracticeExam createPracticeExam(PracticeExam practiceExam) {
		return practiceExamRepository.save(practiceExam);
	}

	@Override
	public PracticeExam getPracticeExamByShortCode(String shortCode) {
		Optional<PracticeExam> practiceExamOpt = practiceExamRepository.findByShortCode(shortCode);
		if (practiceExamOpt.isEmpty()) {
			throw new NotFoundException("Practice Exam Not Found!");
		}
		return practiceExamOpt.get();

	}

}
