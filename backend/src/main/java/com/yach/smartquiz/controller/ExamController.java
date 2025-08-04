package com.yach.smartquiz.controller;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.yach.smartquiz.custom_exception.BadRequestException;
import com.yach.smartquiz.custom_exception.ForbiddenAccessException;
import com.yach.smartquiz.custom_exception.TakingExamCustomException;
import com.yach.smartquiz.entity.Exam;
import com.yach.smartquiz.entity.ExamInvitation;
import com.yach.smartquiz.entity.ExamStatus;
import com.yach.smartquiz.entity.Option;
import com.yach.smartquiz.entity.PracticeExam;
import com.yach.smartquiz.entity.Question;
import com.yach.smartquiz.entity.QuestionType;
import com.yach.smartquiz.entity.ScoreDistribution;
import com.yach.smartquiz.entity.Topic;
import com.yach.smartquiz.entity.User;
import com.yach.smartquiz.entity.UserAnswer;
import com.yach.smartquiz.entity.UserExam;
import com.yach.smartquiz.messaging.EmailProducer;
import com.yach.smartquiz.messaging.ExamInvitationMessagingRequest;
import com.yach.smartquiz.repository.InvitationAcceptResponse;
import com.yach.smartquiz.request.ExamCreateRequest;
import com.yach.smartquiz.request.InviteParticipantsToExamRequest;
import com.yach.smartquiz.request.PracticeExamCreateRequest;
import com.yach.smartquiz.request.SubmitExamRequest;
import com.yach.smartquiz.request.TakeExamRequest;
import com.yach.smartquiz.request.UserExamListResponse;
import com.yach.smartquiz.response.CommonWrongAnswers;
import com.yach.smartquiz.response.ExamCreateResponse;
import com.yach.smartquiz.response.ExamDetailResponse;
import com.yach.smartquiz.response.ExamListResponse;
import com.yach.smartquiz.response.ExamResultResponse;
import com.yach.smartquiz.response.ExamResultStudent;
import com.yach.smartquiz.response.ExamStats;
import com.yach.smartquiz.response.LeaderboardRow;
import com.yach.smartquiz.response.NotificationListResponse;
import com.yach.smartquiz.response.OptionResponse;
import com.yach.smartquiz.response.PaginatedResponse;
import com.yach.smartquiz.response.PracticeExamQuestionAndExamDataResponse;
import com.yach.smartquiz.response.PracticeExamReviewResponse;
import com.yach.smartquiz.response.QuestionAnalytics;
import com.yach.smartquiz.response.QuestionResponse;
import com.yach.smartquiz.response.QuestionReviewResponse;
import com.yach.smartquiz.response.QuestionStats;
import com.yach.smartquiz.service.ExamInvitationService;
import com.yach.smartquiz.service.ExamService;
import com.yach.smartquiz.service.LeaderboardService;
import com.yach.smartquiz.service.NotificationService;
import com.yach.smartquiz.service.PracticeExamService;
import com.yach.smartquiz.service.QuestionService;
import com.yach.smartquiz.service.TopicService;
import com.yach.smartquiz.service.UserAnswerService;
import com.yach.smartquiz.service.UserExamService;
import com.yach.smartquiz.service.UserService;

@RestController
@RequestMapping("api/exam")
public class ExamController {

	private final ExamService examService;
	private final UserExamService userExamService;
	private final TopicService topicService;
	private final PracticeExamService practiceExamService;
	private final QuestionService questionService;
	private final UserAnswerService userAnswerService;
	private final UserService userService;
	private final ExamInvitationService examInvitationService;
	private final EmailProducer emailProducer;
	private final NotificationService notificationService;
	private final LeaderboardService leaderboardService;

	public ExamController(ExamService examService, UserExamService userExamService, TopicService topicService,
			PracticeExamService practiceExamService, QuestionService questionService,
			UserAnswerService userAnswerService, UserService userService, ExamInvitationService examInvitationService,
			EmailProducer emailProducer, NotificationService notificationService,
			LeaderboardService leaderboardService) {
		super();
		this.examService = examService;
		this.userExamService = userExamService;
		this.topicService = topicService;
		this.practiceExamService = practiceExamService;
		this.questionService = questionService;
		this.userAnswerService = userAnswerService;
		this.userService = userService;
		this.examInvitationService = examInvitationService;
		this.emailProducer = emailProducer;
		this.notificationService = notificationService;
		this.leaderboardService = leaderboardService;
	}

	@PreAuthorize("hasAuthority('EXAM_CREATE')")
	@PostMapping("/create")
	public ResponseEntity<ExamCreateResponse> createExam(@RequestBody ExamCreateRequest request) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Exam exam = examService.createExam(request, false, user);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(new ExamCreateResponse(exam.getId(), exam.getName(), exam.getDescription(), exam.getShortCode(),
						exam.getStartDate() == null ? null : exam.getStartDate().toString(),
						exam.getQuestions() == null ? 0 : exam.getQuestions().size(), exam.getDuration()));
	}

	@PreAuthorize("hasAuthority('EXAM_UPDATE')")
	@PostMapping("/update")
	public ResponseEntity<ExamCreateResponse> updateExam(@RequestBody ExamCreateRequest request) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Exam existedExam = examService.getExamById(request.examCredentials().id());
		if (user.getId() != existedExam.getCreatedBy().getId()) {
			throw new ForbiddenAccessException("You don't have permission to edit!");
		}
		Exam exam = examService.createExam(request, false, user);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(new ExamCreateResponse(exam.getId(), exam.getName(), exam.getDescription(), exam.getShortCode(),
						exam.getStartDate() == null ? null : exam.getStartDate().toString(),
						exam.getQuestions() == null ? 0 : exam.getQuestions().size(), exam.getDuration()));
	}

	@PreAuthorize("hasAuthority('EXAM_CREATE')")
	@PostMapping("/draft")
	public ResponseEntity<ExamCreateResponse> createDraftExam(@RequestBody ExamCreateRequest request) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Exam exam = examService.createExam(request, true, user);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(new ExamCreateResponse(exam.getId(), exam.getName(), exam.getDescription(), exam.getShortCode(),
						exam.getStartDate() == null ? null : exam.getStartDate().toString(),
						exam.getQuestions() == null ? 0 : exam.getQuestions().size(), exam.getDuration()));
	}

	@PreAuthorize("hasAuthority('EXAM_CREATE')")
	@PostMapping("/publish")
	public ResponseEntity<?> publishExam(@RequestParam String examCode) {
		try {
			examService.publishExam(examCode);
			return ResponseEntity.ok("Exam successfully published");
		} catch (IllegalStateException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error occurred");
		}
	}

	@PreAuthorize("hasAuthority('EXAM_LIST_GET')")
	@GetMapping("/all")
	public ResponseEntity<PaginatedResponse<ExamListResponse>> getAllExam(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "5") int size, @RequestParam(required = false) String keyword,
			@RequestParam(required = false) ExamStatus status) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		QuestionType defaultQuestionType = user.getUserSettings().getSelectedSubject();
		List<ExamListResponse> exams = this.getFormattedExamListResponse(keyword, status, defaultQuestionType.getId());
		List<ExamListResponse> allExams = exams.stream().filter(e -> e.creatorEmail().equals(user.getEmail()))
				.collect(Collectors.toList());
		long activeExams = allExams.stream().filter(exam -> exam.status().equals(ExamStatus.PUBLISHED.toString()))
				.filter(exam -> {
					try {
						LocalDateTime now = LocalDateTime.now();
						LocalDateTime start = LocalDateTime.parse(exam.startDate());
						LocalDateTime end = LocalDateTime.parse(exam.endDate());
						return !now.isBefore(start) && !now.isAfter(end);
					} catch (Exception e) {
						return false;
					}
				}).count();
		int totalParticipants = allExams.stream().mapToInt(exam -> exam.examStats().totalCompleted()).sum();

		int total = allExams.size();
		int start = page * size;
		int end = Math.min(start + size, total);
		double averagePassRate = Math
				.round(allExams.stream().filter(e -> e.examStats() != null && e.examStats().totalParticipants() > 0)
						.mapToDouble(e -> e.examStats().passRate()).average().orElse(0.0) * 100.0)
				/ 100.0;

		if (start > end) {
			return ResponseEntity.ok(new PaginatedResponse<>(Collections.emptyList(), page, size, total));
		}
		List<ExamListResponse> pagedExams = allExams.subList(start, end);
		Map<String, Object> credentialResponse = new HashMap<>();
		credentialResponse.put("totalExam", total);
		credentialResponse.put("activeExam", activeExams);
		credentialResponse.put("totalParticipants", totalParticipants);
		credentialResponse.put("averagePassRate", averagePassRate);

		PaginatedResponse<ExamListResponse> response = new PaginatedResponse<>(pagedExams, credentialResponse, page,
				size, total);
		return ResponseEntity.ok(response);
	}

	private List<Exam> getAllFilteredExams(String keyword, ExamStatus status) {
		boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();
		if (!hasKeyword && status == null) {
			return examService.getAllExam();
		}
		if (!hasKeyword) {
			if (ExamStatus.ACTIVE.equals(status)) {
				return examService.getActiveExams();
			} else if (ExamStatus.COMPLETED.equals(status)) {
				return examService.getCompletedExams();
			} else {
				return examService.getAllByStatus(status);
			}
		}
		if (ExamStatus.ACTIVE.equals(status)) {
			return examService.searchActiveExams(keyword);
		} else if (ExamStatus.COMPLETED.equals(status)) {
			return examService.searchCompletedExams(keyword);
		} else if (status != null) {
			return examService.searchExamsByKeywordAndStatus(keyword, status);
		} else {
			return examService.searchExams(keyword);
		}
	}

	private List<ExamListResponse> getFormattedExamListResponse(String keyword, ExamStatus status,
			Long questionTypeId) {
		List<Exam> exams = this.getAllFilteredExams(keyword, status);
		return exams.stream().sorted(Comparator.comparing(Exam::getCreatedAt).reversed()).filter(e -> {
			List<Question> questions = e.getQuestions();
			if (questions == null || questions.isEmpty()) {
				return true;
			}
			Question firstQuestion = questions.get(0);
			if (firstQuestion == null || firstQuestion.getTopic() == null
					|| firstQuestion.getTopic().getChapter() == null
					|| firstQuestion.getTopic().getChapter().getType() == null
					|| firstQuestion.getTopic().getChapter().getType().getId() == null) {
				return false;
			}
			return firstQuestion.getTopic().getChapter().getType().getId().equals(questionTypeId);
		}).map(this::convertToExamCreationResponse).toList();
	}

	private ExamListResponse convertToExamCreationResponse(Exam exam) {
		List<ExamInvitation> examInvitations = examInvitationService.findByExam(exam);
		List<String> emails = examInvitations.stream().map(ExamInvitation::getEmail).collect(Collectors.toList());
		if (exam.getStatus().equals(ExamStatus.DRAFT)) {
			return new ExamListResponse(exam.getId(), exam.getCreatedBy().getEmail(), exam.getShortCode(),
					exam.getName(), exam.getDescription(), exam.getStatus().toString(),
					exam.getQuestions() != null ? exam.getQuestions().size() : 0, exam.getDuration(),
					exam.getPassingScore(), exam.getStartDate() == null ? null : exam.getStartDate().toString(),
					exam.getEndDate() == null ? null : exam.getEndDate().toString(),
					exam.getCreatedAt() == null ? null : exam.getCreatedAt().toString(),
					exam.getUpdatedAt() == null ? null : exam.getUpdatedAt().toString(), exam.getName(),
					exam.getMaximumAttempt(), false, true, new ExamStats(0, 0, 0, 0, 0, BigDecimal.valueOf(0)), emails,
					exam.isPublic());
		}
		List<UserExam> userExams = userExamService.getAllUserExamByExam(exam);
		List<String> additionalEmails = userExams.stream().map(ue -> ue.getUser().getEmail())
				.filter(email -> !emails.contains(email)).toList();
		int totalParticipant = emails.size() + additionalEmails.size();

		double averageTimeInMinutes = userExams.stream()
				.filter(ue -> ue.getStartedAt() != null && ue.getSubmittedAt() != null)
				.mapToLong(ue -> java.time.Duration.between(ue.getStartedAt(), ue.getSubmittedAt()).toMillis())
				.average().orElse(0) / 60000.0;
		int completedUsers = (int) userExams.stream().filter(ue -> ue.getSubmittedAt() != null).count();
		BigDecimal roundedAverage = BigDecimal.valueOf(averageTimeInMinutes).setScale(2, RoundingMode.HALF_UP);
		int numberOfStudents = userExams.size();
		int passingScore = exam.getPassingScore();
		long passedStudents = userExams.stream()
				.filter(ue -> (ue.getScore() != null ? ue.getScore() : 0) >= passingScore).count();
		int passRate = numberOfStudents == 0 ? 0 : (int) ((passedStudents * 100.0) / numberOfStudents);
		int totalScore = userExams.stream().mapToInt(ue -> ue.getScore() != null ? ue.getScore() : 0).sum();
		int averageTotalScore = userExams.size() == 0 ? 0 : totalScore / userExams.size();
		int averageScore = exam.getQuestions().size() == 0 ? 0 : (averageTotalScore * 100 / exam.getQuestions().size());
		return new ExamListResponse(exam.getId(), exam.getCreatedBy().getEmail(), exam.getShortCode(), exam.getName(),
				exam.getDescription(), exam.getStatus().toString(), exam.getQuestions().size(), exam.getDuration(),
				exam.getPassingScore(), exam.getStartDate().toString(), exam.getEndDate().toString(),
				exam.getCreatedAt().toString(), exam.getUpdatedAt().toString(), exam.getName(),
				exam.getMaximumAttempt(), false, true,
				new ExamStats(totalParticipant, completedUsers, 1, averageScore, passRate, roundedAverage), emails,
				exam.isPublic());
	}

	@PreAuthorize("hasAuthority('EXAM_DELETE')")
	@DeleteMapping("/delete")
	public ResponseEntity<String> deleteExam(@RequestParam Long id) {
		examService.deleteExamById(id);
		return ResponseEntity.ok("Successfully deleted!");
	}

	@PreAuthorize("hasAuthority('EXAM_PRACTICE_CREATE')")
	@PostMapping("/create-practice")
	public ResponseEntity<String> createPracticeExam(@RequestBody PracticeExamCreateRequest request) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		PracticeExam practiceExam = new PracticeExam();
		List<Topic> topics = request.topicList().stream().map(topicService::getTopicById).collect(Collectors.toList());
		practiceExam.setYears(request.yearList());
		practiceExam.setTopics(topics);
		practiceExam.setIsRandom(request.isOptionRandom());
		practiceExam.setNumberOfQuestions(request.numberOfQuestions());
		practiceExam.setDuration(request.duration());
		practiceExam.setStartDate(LocalDateTime.now());
		practiceExam.setUser(user);
		PracticeExam createdExam = practiceExamService.createPracticeExam(practiceExam);
		if (createdExam == null) {
			throw new BadRequestException("Error Occurred");
		}

		return ResponseEntity.ok(createdExam.getShortCode());
	}

	@PreAuthorize("hasAuthority('EXAM_PRACTICE_START')")
	@GetMapping("/practice")
	public ResponseEntity<PracticeExamQuestionAndExamDataResponse> takePracticeExam(@RequestParam String examCode) {
		PracticeExam practiceExam = practiceExamService.getPracticeExamByShortCode(examCode);
		List<Topic> topics = practiceExam.getTopics();
		List<String> years = practiceExam.getYears();
		Integer numberOfQuestions = practiceExam.getNumberOfQuestions();
		Boolean isOptionRandom = practiceExam.getIsRandom();
		List<Question> allFilteredQuestions = topics.stream().flatMap(topic -> topic.getQuestions().stream())
				.filter(q -> years.contains(q.getYear())).collect(Collectors.toList());

		if (isOptionRandom) {
			Collections.shuffle(allFilteredQuestions);
		}

		List<Question> limitedQuestions = allFilteredQuestions.stream().limit(numberOfQuestions)
				.collect(Collectors.toList());
		if (isOptionRandom) {
			for (Question question : limitedQuestions) {
				System.out.println(question.getOptions().size());
				Collections.shuffle(question.getOptions());
			}
		}
		List<QuestionResponse> questions = limitedQuestions.stream()
				.map(q -> new QuestionResponse(q.getId(), "multiple-choice", q.getImageUrl() != null, q.getImageUrl(),
						"Image related to the question", q.getQuestionText(), q.getExplanation(),
						q.getOptions().stream()
								.map(opt -> new OptionResponse(opt.getId(), opt.getOptionText(),
										opt.getImageUrl() != null, opt.getImageUrl(), "Option image", null))
								.collect(Collectors.toList())

				)).collect(Collectors.toList());

		return ResponseEntity
				.ok(new PracticeExamQuestionAndExamDataResponse(questions, practiceExam.getName(), null, null));
	}

	@PreAuthorize("hasAuthority('EXAM_TAKE')")
	@PostMapping("/start")
	public ResponseEntity<PracticeExamQuestionAndExamDataResponse> takeExam(@RequestBody TakeExamRequest request) {
		Exam exam = examService.getExamByShortCode(request.examCode());
		if (exam != null && exam.getEndDate() != null && LocalDateTime.now().isAfter(exam.getEndDate())) {
			throw new TakingExamCustomException("EXAM_OVER", exam.getStartDate(), exam.getEndDate());
		}
		if (exam != null && exam.getStartDate() != null && LocalDateTime.now().isBefore(exam.getStartDate())) {
			throw new TakingExamCustomException("EXAM_NOT_START", exam.getStartDate(), exam.getEndDate());
		}
		if (!(exam.getStatus().equals(ExamStatus.PUBLISHED))) {
			throw new TakingExamCustomException("EXAM_NOT_PUBLISH", exam.getStartDate(), exam.getEndDate());
		}

		User user = userService.getUserByEmailForExam(request.email());
		UserExam userExam;
		boolean isNewExam = false;
		if (user == null) {
			ExamInvitation examInvitation = examInvitationService.getByEmailAndExam(request.email(), exam);
			userExam = userExamService.getUserExamByGuestUserAndExam(examInvitation, exam);

			if (userExam == null) {
				userExam = new UserExam();
				userExam.setExam(exam);
				userExam.setGuestUser(examInvitation);
				userExam.setStartedAt(LocalDateTime.now());
				userExam = userExamService.createUserExam(userExam);
				isNewExam = true;
			}
		} else {
			userExam = userExamService.getUserExamByUserAndExam(user, exam);

			if (userExam == null) {
				userExam = new UserExam();
				userExam.setExam(exam);
				userExam.setUser(user);
				userExam.setStartedAt(LocalDateTime.now());
				userExam = userExamService.createUserExam(userExam);
				isNewExam = true;
			}
		}

		List<QuestionResponse> questions = exam.getQuestions().stream().map(q -> new QuestionResponse(q.getId(),
				"multiple-choice", q.getImageUrl() != null, q.getImageUrl(), "Image related to the question",
				q.getQuestionText(), q.getExplanation(),
				q.getOptions().stream()
						.map(opt -> new OptionResponse(opt.getId(), opt.getOptionText(), opt.getImageUrl() != null,
								opt.getImageUrl(), "Option image", null))
						.collect(Collectors.toList())))
				.collect(Collectors.toList());

		return ResponseEntity.status(isNewExam ? HttpStatus.CREATED : HttpStatus.OK)
				.body(new PracticeExamQuestionAndExamDataResponse(questions, exam.getName(), exam.getDuration(),
						userExam.getStartedAt().toString()));
	}

	@PreAuthorize("hasAuthority('EXAM_PRACTICE_SUBMIT')")
	@PostMapping("/submit-practice")
	public ResponseEntity<String> submitPracticeExamAnswer(@RequestBody SubmitExamRequest request) {
		PracticeExam practiceExam = practiceExamService.getPracticeExamByShortCode(request.examCode());
		request.questionAnswerList().forEach((questionId, selectedOptionId) -> {
			Question question = questionService.getQuestionById(questionId);
			Option selectedOption = question.getOptions().stream().filter(o -> o.getId().equals(selectedOptionId))
					.findFirst().orElseThrow(
							() -> new BadRequestException("Selected option not found for question ID: " + questionId));
			UserAnswer userAnswer = new UserAnswer();
			userAnswer.setQuestion(question);
			userAnswer.setPracticeExam(practiceExam);
			userAnswer.setSelectedOption(selectedOption);
			userAnswer.setIsCorrect(selectedOption.getId().equals(question.getCorrectOption().getId()));
			userAnswerService.createUserAnswer(userAnswer);
		});
		return ResponseEntity.ok("Answers submitted successfully");
	}

	@PreAuthorize("hasAuthority('EXAM_SUBMIT')")
	@PostMapping("/submit-exam")
	public ResponseEntity<String> submitExamAnswer(@RequestBody SubmitExamRequest request) {
		Exam exam = examService.getExamByShortCode(request.examCode());
		User user = userService.getUserByEmailForExam(request.email());

		UserExam userExam;

		if (user == null) {
			ExamInvitation examInvitation = examInvitationService.getByEmailAndExam(request.email(), exam);
			userExam = userExamService.getUserExamByGuestUserAndExam(examInvitation, exam);
		} else {
			userExam = userExamService.getUserExamByUserAndExam(user, exam);
		}

		if (userExam == null) {
			throw new BadRequestException("No UserExam found for this user or guest and exam.");
		}

		if (userExam.getSubmittedAt() != null) {
			throw new BadRequestException("This exam has already been submitted.");
		}

		AtomicInteger score = new AtomicInteger(0);

		request.questionAnswerList().forEach((questionId, selectedOptionId) -> {
			Question question = questionService.getQuestionById(questionId);

			Option selectedOption = question.getOptions().stream().filter(o -> o.getId().equals(selectedOptionId))
					.findFirst().orElseThrow(
							() -> new BadRequestException("Selected option not found for question ID: " + questionId));

			boolean isCorrect = question.getCorrectOption() != null
					&& selectedOption.getId().equals(question.getCorrectOption().getId());

			UserAnswer userAnswer = new UserAnswer();
			userAnswer.setQuestion(question);
			userAnswer.setUserExam(userExam);
			userAnswer.setSelectedOption(selectedOption);
			userAnswer.setIsCorrect(isCorrect);

			userAnswerService.createUserAnswer(userAnswer);

			if (isCorrect) {
				score.incrementAndGet();
			}
		});

		userExam.setScore(score.get());
		userExam.setSubmittedAt(LocalDateTime.now());
		userExamService.saveUserExam(userExam);

		return ResponseEntity.ok("Score: " + score.get() + "/" + request.questionAnswerList().size());
	}

	@PreAuthorize("hasAuthority('EXAM_PRACTICE_RESULT')")
	@GetMapping("/result")
	public ResponseEntity<ExamResultResponse> getPracticeExamResult(@RequestParam String examCode) {
		PracticeExam practiceExam = practiceExamService.getPracticeExamByShortCode(examCode);
		String examTitle = practiceExam.getName();
		int numberOfQuestions = practiceExam.getNumberOfQuestions();

		List<UserAnswer> correctAnswers = userAnswerService.getCorrectAnswersByPracticeExam(practiceExam);
		int correctCount = correctAnswers.size();
		int score = (int) Math.round((double) correctCount / numberOfQuestions * 100);

		Instant startTime = practiceExam.getCreatedAt();
		Instant endTime = correctAnswers.isEmpty() ? Instant.now()
				: correctAnswers.get(0).getCreatedAt().atZone(ZoneId.systemDefault()).toInstant();

		long timeTaken = Duration.between(startTime, endTime).toMinutes();

		QuestionStats correctStat = new QuestionStats("Correct", correctCount);
		QuestionStats incorrectStat = new QuestionStats("Incorrect", numberOfQuestions - correctCount);
		List<QuestionStats> questionStats = List.of(correctStat, incorrectStat);

		ExamResultResponse response = new ExamResultResponse(examTitle, score, numberOfQuestions, correctCount,
				(int) timeTaken, endTime.toString(), questionStats);

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAuthority('EXAM_PRACTICE_REVIEW')")
	@GetMapping("/review")
	public ResponseEntity<PracticeExamReviewResponse> getPracticeExamReviewData(@RequestParam String examCode) {
		PracticeExam practiceExam = practiceExamService.getPracticeExamByShortCode(examCode);
		List<UserAnswer> userAnswers = userAnswerService.getAnswersWithQuestionAndOptionsByPracticeExam(practiceExam);
		List<QuestionReviewResponse> questions = new ArrayList<>();
		for (UserAnswer ua : userAnswers) {
			Question question = ua.getQuestion();
			List<OptionResponse> optionResponses = question
					.getOptions().stream().map(o -> new OptionResponse(o.getId(), o.getOptionText(),
							o.getImageUrl() == null, o.getImageUrl(), "Option Image", null))
					.collect(Collectors.toList());

			QuestionReviewResponse qr = new QuestionReviewResponse(question.getId(), question.getImageUrl() == null,
					question.getImageUrl(), "Question Image", question.getQuestionText(), question.getExplanation(),
					ua.getSelectedOption() != null ? ua.getSelectedOption().getId() : null,
					question.getCorrectOption() != null ? question.getCorrectOption().getId() : null, ua.getIsCorrect(),
					optionResponses);

			questions.add(qr);
		}
		String examTitle = practiceExam.getName();
		int numberOfQuestions = practiceExam.getNumberOfQuestions();
		List<UserAnswer> correctAnswers = userAnswerService.getCorrectAnswersByPracticeExam(practiceExam);
		int correctCount = correctAnswers.size();
		int score = (int) Math.round((double) correctCount / numberOfQuestions * 100);
		Instant startTime = practiceExam.getCreatedAt();
		Instant endTime = correctAnswers.isEmpty() ? Instant.now()
				: correctAnswers.get(0).getCreatedAt().atZone(ZoneId.systemDefault()).toInstant();
		long timeTaken = Duration.between(startTime, endTime).toMinutes();
		PracticeExamReviewResponse response = new PracticeExamReviewResponse(examTitle, score, numberOfQuestions,
				correctCount, (int) timeTaken, userAnswers.get(0).getCreatedAt().toString(), questions);
		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAuthority('EXAM_REVIEW')")
	@GetMapping("/exam-review")
	public ResponseEntity<PracticeExamReviewResponse> getUserExamReviewData(@RequestParam String examCode,
			String email) {
		Exam exam = examService.getExamByShortCode(examCode);
		User user = userService.getUserByEmail(email);
		UserExam userExam = userExamService.getUserExamByUserAndExam(user, exam);
		List<UserAnswer> userAnswers = userAnswerService.getAnswersWithQuestionAndOptionsByUserExam(userExam);
		List<QuestionReviewResponse> questions = new ArrayList<>();
		for (UserAnswer ua : userAnswers) {
			Question question = ua.getQuestion();
			List<OptionResponse> optionResponses = question
					.getOptions().stream().map(o -> new OptionResponse(o.getId(), o.getOptionText(),
							o.getImageUrl() == null, o.getImageUrl(), "Option Image", null))
					.collect(Collectors.toList());

			QuestionReviewResponse qr = new QuestionReviewResponse(question.getId(), question.getImageUrl() == null,
					question.getImageUrl(), "Question Image", question.getQuestionText(), question.getExplanation(),
					ua.getSelectedOption() != null ? ua.getSelectedOption().getId() : null,
					question.getCorrectOption() != null ? question.getCorrectOption().getId() : null, ua.getIsCorrect(),
					optionResponses);

			questions.add(qr);
		}
		String examTitle = exam.getName();
		int numberOfQuestions = exam.getQuestions().size();
		int correctCount = userExam.getScore();
		int score = (int) Math.round((double) correctCount / numberOfQuestions * 100);
		LocalDateTime startTime = userExam.getStartedAt();
		LocalDateTime endTime = userExam.getSubmittedAt();
		long timeTaken = Duration.between(startTime, endTime).toMinutes();
		PracticeExamReviewResponse response = new PracticeExamReviewResponse(examTitle, score, numberOfQuestions,
				correctCount, (int) timeTaken, userExam.getStartedAt().toString(), questions);
		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAuthority('EXAM_DETAIL')")
	@GetMapping("exam-detail")
	public ResponseEntity<ExamDetailResponse> getExamDetail(@RequestParam String examCode) {
		Exam exam = examService.getExamByShortCode(examCode);
		List<UserExam> userExams = userExamService.getAllUserExamByExam(exam);
		return ResponseEntity.ok(new ExamDetailResponse(this.getScoreDistribution(userExams, exam),
				this.getTimeAnalysis(userExams, exam), this.getExamResultStudentList(userExams),
				this.getQuestionAnalytics(userExams, exam)));
	}

	private List<ScoreDistribution> getScoreDistribution(List<UserExam> userExams, Exam exam) {

		int numberOfQuestions = exam.getQuestions().size();
		int passingScore = exam.getPassingScore();

		int passingPercentage = passingScore * 100 / numberOfQuestions;
		int remaining = 100 - passingPercentage;

		int justPassMax = passingPercentage + (remaining * 60 / 100);
		int goodMax = justPassMax + (remaining * 25 / 100);
		int excellentMin = goodMax + 1;

		int failCount = 0;
		int passCount = 0;
		int goodCount = 0;
		int excellentCount = 0;
		for (UserExam ue : userExams) {
			int scorePercentage = ue.getScore() == null ? 0 : ue.getScore() * 100 / numberOfQuestions;
			if (scorePercentage < passingPercentage) {
				failCount++;
			} else if (scorePercentage <= justPassMax) {
				passCount++;
			} else if (scorePercentage <= goodMax) {
				goodCount++;
			} else {
				excellentCount++;
			}
		}
		List<ScoreDistribution> scoreDistributions = List.of(
				new ScoreDistribution(excellentMin + "-100% (Excellent)", excellentCount),
				new ScoreDistribution((justPassMax + 1) + "-" + goodMax + "% (Good)", goodCount),
				new ScoreDistribution(passingPercentage + "-" + justPassMax + "% (Pass)", passCount),
				new ScoreDistribution("Below " + passingPercentage + "% (Fail)", failCount));

		return scoreDistributions;
	}

	private Map<String, Object> getTimeAnalysis(List<UserExam> userExams, Exam exam) {

		int examDuration = exam.getDuration();
		double fastThreshold = examDuration * 0.60;
		double fullThreshold = examDuration * 0.90;

		int fastCount = 0;
		int averageCount = 0;
		int fullCount = 0;

		double fastestTime = Double.MAX_VALUE;

		for (UserExam ue : userExams) {
			long secondsTaken = Duration
					.between(ue.getStartedAt(), ue.getSubmittedAt() == null ? ue.getStartedAt() : ue.getSubmittedAt())
					.getSeconds();
			double timeTaken = secondsTaken / 60.0;
			fastestTime = Math.min(fastestTime, timeTaken);

			if (timeTaken < fastThreshold) {
				fastCount++;
			} else if (timeTaken < fullThreshold) {
				averageCount++;
			} else {
				fullCount++;
			}
		}

		List<Map<String, Object>> timeBuckets = List.of(
				Map.of("label", "Fast (< " + (int) fastThreshold + " min)", "count", fastCount),
				Map.of("label", "Average (" + (int) fastThreshold + "–" + (int) fullThreshold + " min)", "count",
						averageCount),
				Map.of("label", "Used Full Time (≥ " + (int) fullThreshold + " min)", "count", fullCount));

		return Map.of("fastestTime", String.format("%.2f", fastestTime), "timeBuckets", timeBuckets);
	}

	private List<ExamResultStudent> getExamResultStudentList(List<UserExam> userExams) {
		List<ExamResultStudent> students = new ArrayList<>();
		for (UserExam ue : userExams) {
			long secondsTaken = Duration
					.between(ue.getStartedAt(), ue.getSubmittedAt() == null ? ue.getStartedAt() : ue.getSubmittedAt())
					.getSeconds();
			double timeTaken = secondsTaken / 60.0;

			double formattedTimeTaken = Double.parseDouble(String.format("%.2f", timeTaken));
			String username = ue.getUser() == null ? ue.getGuestUser().getEmail() : ue.getUser().getUsername();
			String email = ue.getUser() == null ? ue.getGuestUser().getEmail() : ue.getUser().getEmail();
			ExamResultStudent student = new ExamResultStudent(ue.getId(), username, email,
					ue.getScore() == null ? 0 : ue.getScore(),
					ue.getScore() == null ? 0 : ue.getScore() * 100 / ue.getExam().getQuestions().size(),
					formattedTimeTaken, "Completed", 1,
					ue.getSubmittedAt() == null ? ue.getStartedAt().toString() : ue.getSubmittedAt().toString(),
					ue.getScore() == null ? 0 : ue.getScore(), ue.getExam().getQuestions().size());

			students.add(student);
		}
		return students;
	}

	private List<QuestionAnalytics> getQuestionAnalytics(List<UserExam> userExams, Exam exam) {
		List<Question> questions = exam.getQuestions();
		List<QuestionAnalytics> questionAnalytics = new ArrayList<>();

		for (Question question : questions) {
			int correctCount = 0;
			int totalAttempt = 0;

			Map<String, Integer> wrongAnswerCounts = new HashMap<>();

			for (UserExam userExam : userExams) {

				UserAnswer userAnswer = userAnswerService.getByUserExamAndQuestion(userExam, question);

				if (userAnswer != null && userAnswer.getSelectedOption() != null) {
					totalAttempt++;
					if (Boolean.TRUE.equals(userAnswer.getIsCorrect())) {
						correctCount++;
					} else {
						String wrongAnswerText = userAnswer.getSelectedOption().getOptionText();
						wrongAnswerCounts.put(wrongAnswerText, wrongAnswerCounts.getOrDefault(wrongAnswerText, 0) + 1);
					}
				}
			}

			int percentage = totalAttempt > 0 ? (correctCount * 100 / totalAttempt) : 0;

			List<CommonWrongAnswers> commonWrongAnswers = wrongAnswerCounts.entrySet().stream()
					.map(entry -> new CommonWrongAnswers(entry.getKey(), entry.getValue()))
					.sorted((a, b) -> Integer.compare(b.count(), a.count())).collect(Collectors.toList());

			QuestionAnalytics analytics = new QuestionAnalytics(question.getId(), question.getQuestionText(),
					question.getTopic().getName(), totalAttempt, correctCount, percentage, commonWrongAnswers);

			questionAnalytics.add(analytics);
		}

		return questionAnalytics;
	}

	@PreAuthorize("hasAuthority('EXAM_CODE_CHECK')")
	@GetMapping("/check-examcode")
	public ResponseEntity<String> checkExamValidity(@RequestParam String examCode) {

		Exam exam = examService.getExamByShortCode(examCode);
		if (exam == null) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok("Exam Found!");
	}

	@PreAuthorize("hasAuthority('EXAM_INVITE')")
	@PostMapping("/invite-participant")
	public ResponseEntity<String> inviteParticipantsToExam(@RequestBody InviteParticipantsToExamRequest request) {
		List<String> emails = request.emails();
		Exam exam = examService.getExamByShortCode(request.examCode());
		String examName = exam.getName();
		LocalDateTime deadline = exam.getEndDate();

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE, dd MMMM yyyy HH:mm", Locale.ENGLISH);
		String formattedDate = deadline.format(formatter);

		for (String email : emails) {
			ExamInvitation existedExamInvitation = examInvitationService.getByEmailAndExamWithNullReturn(email, exam);
			if (existedExamInvitation != null) {
				continue;
			}

			ExamInvitation newExamInvitation = new ExamInvitation();
			newExamInvitation.setEmail(email);
			newExamInvitation.setExam(exam);
			ExamInvitation createdExamInvitation = examInvitationService.saveInvitation(newExamInvitation);
			User user = userService.getUserByEmailForExam(email);
			boolean shouldSendEmail = (user == null) || (user.getUserSettings().isEmailNotificationsEnabled());
			boolean shouldSendNotification = user != null;
			if (shouldSendEmail) {
				emailProducer.handleExamInvitationEmail(new ExamInvitationMessagingRequest(email,
						createdExamInvitation.getInvitationToken(), examName, formattedDate));
			}
			if (shouldSendNotification) {
				NotificationListResponse notification = new NotificationListResponse(createdExamInvitation.getId(),
						exam.getName(), exam.getCreatedBy().getName(), exam.getName(), exam.getStartDate().toString(),
						exam.getEndDate().toString(), false, exam.getQuestions().size(), exam.getDuration(),
						exam.getShortCode());
				notificationService.sendInvitateNotificationToEmail(email, notification);
			}
		}
		return ResponseEntity.ok("Invitation email(s) have been sent successfully!");
	}

	@GetMapping("/invite/accept")
	public ResponseEntity<InvitationAcceptResponse> handleInvitation(@RequestParam String token) {
		ExamInvitation invitation = examInvitationService.getByToken(token);

		if (invitation == null) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid or expired invitation");
		}
		if (invitation.getExam().getEndDate().isBefore(LocalDateTime.now())) {
			throw new ResponseStatusException(HttpStatus.GONE, "Exam has already ended");
		}
		if (invitation.getRespondedAt() != null) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "You have already taken the exam!");
		}
		if (!invitation.getExam().getStatus().equals(ExamStatus.PUBLISHED)) {
			System.out.println("indsajflj");
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Exam has not been published!");
		}
		if (userService.getUserByEmailForExam(invitation.getEmail()) == null) {
			System.out.println("User doesn't exist");
		}
		invitation.setAccepted(true);
		invitation.setRespondedAt(Instant.now());
		examInvitationService.saveInvitation(invitation);
		String examCode = invitation.getExam().getShortCode();
		String email = invitation.getEmail();
		Boolean isUserExisted = userService.getUserByEmailForExam(email) != null;
		return ResponseEntity.ok(new InvitationAcceptResponse(examCode, email, isUserExisted));
	}

	@GetMapping("/exam/questions")
	public ResponseEntity<List<Long>> handleInvitation(@RequestParam Long examId) {
		Exam exam = examService.getExamById(examId);
		List<Long> idList = exam.getQuestions().stream().map(Question::getId).collect(Collectors.toList());
		return ResponseEntity.ok(idList);
	}

	@PutMapping("/make-public")
	public ResponseEntity<String> makeExamPublic(@RequestParam Long examId) {
		Exam exam = examService.getExamById(examId);
		exam.setPublic(!exam.isPublic());
		examService.updateExam(exam);
		return ResponseEntity.ok("Exam is set to public!");
	}

	@GetMapping("/get-exam-list")
	public ResponseEntity<List<UserExamListResponse>> getExamListUser() {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		List<Exam> activeExams = examService.getActiveExams();
		List<UserExam> userExams = userExamService.getUserExamByUser(user);

		Set<Long> userExamIds = userExams.stream().map(userExam -> userExam.getExam().getId())
				.collect(Collectors.toSet());

		List<UserExamListResponse> publicActiveExams = activeExams.stream().filter(Exam::isPublic).map(e -> {
			boolean alreadyTaken = userExamIds.contains(e.getId());
			return new UserExamListResponse(e.getId(), e.getName(), e.getDescription(), e.getQuestions().size(),
					e.getDuration(), e.getShortCode(), e.getCreatedBy().getName(), alreadyTaken);
		}).collect(Collectors.toList());

		return ResponseEntity.ok(publicActiveExams);
	}

	@GetMapping("/get-invited-exams")
	public ResponseEntity<List<UserExamListResponse>> getInvitedExamListUser() {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		List<UserExam> userExams = userExamService.getUserExamByUser(user);
		Set<Long> takenExamIds = userExams.stream().map(userExam -> userExam.getExam().getId())
				.collect(Collectors.toSet());
		List<Exam> invitedExams = examInvitationService.getByEmail(user.getEmail()).stream()
				.map(ExamInvitation::getExam).collect(Collectors.toList());

		List<UserExamListResponse> response = invitedExams.stream()
				.map(e -> new UserExamListResponse(e.getId(), e.getName(), e.getDescription(), e.getQuestions().size(),
						e.getDuration(), e.getShortCode(), e.getCreatedBy().getName(),
						takenExamIds.contains(e.getId())))
				.collect(Collectors.toList());

		return ResponseEntity.ok(response);
	}

	@GetMapping("/leaderboard")
	public ResponseEntity<Map<String, Object>> getLeaderboard() {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		List<LeaderboardRow> row = leaderboardService.getGlobalLeaderboard();
		List<LeaderboardRow> top10 = row.subList(0, Math.min(10, row.size()));
		LeaderboardRow myRank = this.getUserRank(user.getId(), row);
		Map<String, Object> response = new HashMap<>();
		response.put("leaderboard", top10);
		response.put("myRank", myRank);
		response.put("totalParticipants", row.size());
		return ResponseEntity.ok(response);
	}

	private LeaderboardRow getUserRank(Long userId, List<LeaderboardRow> leaderboard) {
		for (int i = 0; i < leaderboard.size(); i++) {
			LeaderboardRow row = leaderboard.get(i);
			if (row.getUserId().equals(userId)) {
				return row;
			}
		}
		return null;
	}

}
