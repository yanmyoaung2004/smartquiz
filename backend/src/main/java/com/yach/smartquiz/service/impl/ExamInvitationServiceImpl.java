package com.yach.smartquiz.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.yach.smartquiz.entity.Exam;
import com.yach.smartquiz.entity.ExamInvitation;
import com.yach.smartquiz.repository.ExamInvitationRepository;
import com.yach.smartquiz.service.ExamInvitationService;

@Service
public class ExamInvitationServiceImpl implements ExamInvitationService {

	private final ExamInvitationRepository examInvitationRepository;

	public ExamInvitationServiceImpl(ExamInvitationRepository examInvitationRepository) {
		super();
		this.examInvitationRepository = examInvitationRepository;
	}

	@Override
	public List<ExamInvitation> getByEmail(String email) {
		return examInvitationRepository.findExamsByEmail(email);
	}
	
	@Override
	public List<ExamInvitation> findByExam(Exam exam) {
		return examInvitationRepository.findByExam(exam);
	}

	@Override
	public ExamInvitation getByToken(String token) {
		return examInvitationRepository.findByInvitationToken(token)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid or expired invitation"));
	}

	@Override
	public ExamInvitation saveInvitation(ExamInvitation invitation) {
		return examInvitationRepository.save(invitation);
	}

	@Override
	public ExamInvitation getByEmailAndExam(String email, Exam exam) {
		return examInvitationRepository.findByEmailAndExam(email, exam)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid or expired invitation"));
	}

	@Override
	public ExamInvitation getByEmailAndExamWithNullReturn(String email, Exam exam) {
		Optional<ExamInvitation> examInvitation = examInvitationRepository.findByEmailAndExam(email, exam);
		if (examInvitation.isEmpty()) {
			return null;
		}
		return examInvitation.get();

	}

}
