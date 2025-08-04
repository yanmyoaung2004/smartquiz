package com.yach.smartquiz.service.impl;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.yach.smartquiz.custom_exception.NotFoundException;
import com.yach.smartquiz.entity.Exam;
import com.yach.smartquiz.entity.ExamStatus;
import com.yach.smartquiz.entity.Question;
import com.yach.smartquiz.entity.User;
import com.yach.smartquiz.repository.ExamRepository;
import com.yach.smartquiz.repository.QuestionRepository;
import com.yach.smartquiz.request.ExamCreateRequest;
import com.yach.smartquiz.service.ExamService;

import jakarta.transaction.Transactional;

@Service
public class ExamServiceImpl implements ExamService {

	private final ExamRepository examRepository;

	private final QuestionRepository questionRepository;

	public ExamServiceImpl(ExamRepository examRepository, QuestionRepository questionRepository) {
		super();
		this.examRepository = examRepository;
		this.questionRepository = questionRepository;

	}

	@Override
	public Exam updateExam(Exam exam) {
		return examRepository.save(exam);

	}

	@Override
	public List<Exam> getActiveExams() {
		return examRepository.findActiveExams(LocalDateTime.now());
	}

	@Override
	public List<Exam> getCompletedExams() {
		return examRepository.findCompletedExams(LocalDateTime.now());
	}

	@Override
	public List<Exam> searchActiveExams(String keyword) {
		return examRepository.searchActiveExamsByKeyword(LocalDateTime.now(), keyword);
	}

	@Override
	public List<Exam> searchCompletedExams(String keyword) {
		return examRepository.searchCompletedExamsByKeyword(LocalDateTime.now(), keyword);
	}

	@Override
	public List<Exam> searchExams(String keyword) {
		if (keyword == null || keyword.isBlank()) {
			return (List<Exam>) examRepository.findAll();
		}
		return examRepository.searchByNameOrDescription(keyword);
	}

	@Override
	public List<Exam> searchExamsByKeywordAndStatus(String keyword, ExamStatus status) {
		if ((keyword == null || keyword.isBlank()) && status == null) {
			return (List<Exam>) examRepository.findAll();
		}
		return examRepository.searchByKeywordAndStatus(keyword, status);
	}

	@Override
	public void publishExam(String examCode) {
		Optional<Exam> examOpt = examRepository.findByShortCode(examCode);
		if (examOpt.isEmpty()) {
			throw new NotFoundException("Exam not found");
		}
		Exam exam = examOpt.get();
		exam.setStatus(ExamStatus.PUBLISHED);
		examRepository.save(exam);
	}

	@Override
	@Transactional
	public Exam createExam(ExamCreateRequest request, boolean isDraft, User user) {
		Exam exam = new Exam();
		if (request.examCredentials().id() != null) {
			exam.setId(request.examCredentials().id());
			exam.setCreatedAt(Instant.now());
			exam.setShortCode(request.examCredentials().examCode());
		}
		exam.setCreatedBy(user);
		exam.setName(request.examCredentials().title());
		exam.setDescription(request.examCredentials().description());
		exam.setPassingScore(request.examCredentials().passingScore());
		exam.setMaximumAttempt(request.examCredentials().maxAttempts());
		exam.setIsRandom(request.examCredentials().isRandom());
		exam.setStartDate(parseOrNull(request.examCredentials().startDateTime()));
		exam.setEndDate(parseOrNull(request.examCredentials().endDateTime()));
		exam.setDuration(request.examCredentials().allowedTime());
		if (request.examCredentials().id() == null) {
			if (isDraft)
				exam.setStatus(ExamStatus.DRAFT);
			else
				exam.setStatus(ExamStatus.CREATED);
		} else {
			Optional<Exam> examOpt = examRepository.findById(request.examCredentials().id());
			if (!examOpt.isEmpty()) {
				exam.setStatus(examOpt.get().getStatus());
			}
		}
		if (request.questionList().size() > 0) {
			List<Question> questions = (List<Question>) questionRepository.findAllById(request.questionList());
			exam.setQuestions(questions);
			for (Question question : questions) {
				if (question.getExams() == null) {
					question.setExams(new ArrayList<>());
				}
				question.getExams().add(exam);
			}
		}
		return examRepository.save(exam);
	}

	private LocalDateTime parseOrNull(String dateTime) {
		return (dateTime != null && !dateTime.isEmpty()) ? LocalDateTime.parse(dateTime) : null;
	}

	@Override
	public void deleteExamById(Long id) {
		Optional<Exam> examOptional = examRepository.findById(id);
		if (examOptional.isEmpty()) {
			throw new NotFoundException("user not found!");
		}
		examRepository.deleteById(id);
	}

	@Override
	public Exam getExamById(Long id) {
		Optional<Exam> examOptional = examRepository.findById(id);
		if (examOptional.isEmpty()) {
			throw new NotFoundException("user not found!");
		}
		return examOptional.get();
	}

	@Override
	public List<Exam> getAllExam() {
		return (List<Exam>) examRepository.findAll();
	}

	@Override
	public List<Exam> getAllByStatus(ExamStatus status) {
		return examRepository.findByStatus(status);
	}

	@Override
	public Exam getExamByShortCode(String shortCode) {
		Optional<Exam> examOptional = examRepository.findByShortCode(shortCode);
		if (examOptional.isEmpty()) {
			throw new NotFoundException("Exam not found!");
		}
		return examOptional.get();
	}

}
