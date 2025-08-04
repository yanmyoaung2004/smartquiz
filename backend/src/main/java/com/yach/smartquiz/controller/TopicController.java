package com.yach.smartquiz.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.yach.smartquiz.ai_service.RecommendationService;
import com.yach.smartquiz.entity.Chapter;
import com.yach.smartquiz.entity.PracticeExam;
import com.yach.smartquiz.entity.Question;
import com.yach.smartquiz.entity.QuestionType;
import com.yach.smartquiz.entity.Topic;
import com.yach.smartquiz.entity.User;
import com.yach.smartquiz.entity.UserAnswer;
import com.yach.smartquiz.entity.UserTopicPerformanceForRecommendationDTO;
import com.yach.smartquiz.request.TopicCreateRequest;
import com.yach.smartquiz.response.PracticeHistoryResponse;
import com.yach.smartquiz.response.RecommendedTopicListResponse;
import com.yach.smartquiz.response.TopicListResponse;
import com.yach.smartquiz.service.ChapterService;
import com.yach.smartquiz.service.PracticeExamService;
import com.yach.smartquiz.service.QuestionService;
import com.yach.smartquiz.service.TopicService;
import com.yach.smartquiz.service.UserAnswerService;

@RestController
@RequestMapping("/api/topic")
public class TopicController {

	private final TopicService topicService;

	private final ChapterService chapterService;

	private final QuestionService questionService;

	private final UserAnswerService userAnswerService;

	private final RecommendationService recommendationService;

	private final PracticeExamService practiceExamService;

	public TopicController(TopicService topicService, ChapterService chapterService, QuestionService questionService,
			UserAnswerService userAnswerService, RecommendationService recommendationService,
			PracticeExamService practiceExamService) {
		super();
		this.topicService = topicService;
		this.chapterService = chapterService;
		this.questionService = questionService;
		this.userAnswerService = userAnswerService;
		this.recommendationService = recommendationService;
		this.practiceExamService = practiceExamService;
	}

	@DeleteMapping("/delete")
	public ResponseEntity<String> deleteTopic(@RequestParam Long topicId) {
		topicService.deleteTopicById(topicId);
		return ResponseEntity.status(HttpStatus.CREATED).body("Successfully Deleted!");
	}

	@PostMapping("/create")
	public ResponseEntity<Topic> createTopic(@RequestBody TopicCreateRequest request) {
		Chapter chapter = chapterService.getChapterById(request.chapterId());
		Topic topic = new Topic();
		topic.setName(request.name());
		topic.setDescription(request.description());
		topic.setChapter(chapter);
		Topic newTopic = topicService.createTopic(topic);
		return ResponseEntity.status(HttpStatus.CREATED).body(newTopic);
	}

	@GetMapping("/year")
	public ResponseEntity<List<String>> getYearByTopic(@RequestParam Long topicId) {
		Topic topic = topicService.getTopicById(topicId);
		List<Question> questions = questionService.getAllQuestionByTopic(topic);
		List<String> years = questions.stream().map(Question::getYear).distinct().collect(Collectors.toList());
		return ResponseEntity.ok(years);
	}

	@GetMapping("/all")
	public ResponseEntity<List<TopicListResponse>> getAllTopic() {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		QuestionType type = user.getUserSettings().getSelectedSubject();
		List<Topic> topics = topicService.getByQuestionType(type);
		List<TopicListResponse> response = topics.stream()
				.map(t -> new TopicListResponse(t.getId(), t.getName(), t.getDescription(), t.getQuestions().size(),
						new TopicListResponse.Chapter(t.getChapter().getId(), t.getChapter().getName())))
				.collect(Collectors.toList());
		return ResponseEntity.ok(response);
	}

	@GetMapping("/get-recommendation-history")
	public ResponseEntity<Map<String, Object>> getRecommendedTopicsAndHistory() {
		List<PracticeHistoryResponse> recentPractice = this.getRecentPractice();
		List<RecommendedTopicListResponse> recommendedTopics = this.getRecommendedTopics();
		Map<String, Object> response = new HashMap<>();
		response.put("recentPractice", recentPractice);
		response.put("recommendedTopics", recommendedTopics);
		return ResponseEntity.ok(response);
	}

	private List<RecommendedTopicListResponse> getRecommendedTopics() {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		QuestionType type = user.getUserSettings().getSelectedSubject();
		List<RecommendedTopicListResponse> recommendedTopics = new ArrayList<>();
		List<UserTopicPerformanceForRecommendationDTO> performanceData = userAnswerService
				.findUserTopicPerformanceForRecommendation(user.getId(), type.getId());
		performanceData.stream().forEach(d -> {
			double correctCount = d.getCorrectCount();
			double totalQuestions = d.getTotalQuestions();
			double lastScore = d.getLastScore();
			double numAttempts = d.getNumAttempts();

			Map<String, Object> requestBody = new HashMap<>();
			requestBody.put("user_id", Double.parseDouble(user.getId().toString()));
			requestBody.put("topic_id", Double.parseDouble(d.getTopicId().toString()));
			requestBody.put("correct_count", correctCount);
			requestBody.put("total_questions", totalQuestions);
			requestBody.put("last_score", lastScore);
			requestBody.put("num_attempts", numAttempts);
			boolean prediction = recommendationService.getPrediction(requestBody);
			if (prediction) {
				String feedback = this.generateFeedback(d.getLastScore());
				Topic topic = topicService.getTopicById(d.getTopicId());
				recommendedTopics.add(new RecommendedTopicListResponse(d.getTopicId(), topic.getName(), feedback));
			}
		});
		return recommendedTopics;
	}

	private List<PracticeHistoryResponse> getRecentPractice() {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		QuestionType type = user.getUserSettings().getSelectedSubject();
		List<PracticeExam> practiceExams = practiceExamService.getByUser(user);
		List<PracticeHistoryResponse> response = practiceExams.stream()
				.filter(exam -> exam.getTopics().get(0).getChapter().getType().getId().equals(type.getId()))
				.sorted(Comparator.comparing(PracticeExam::getCreatedAt).reversed()).limit(3).map(exam -> {
					String title = exam.getTopics().stream().map(Topic::getName).collect(Collectors.joining(", "));
					List<UserAnswer> correctAnswers = userAnswerService.getCorrectAnswersByPracticeExam(exam);
					String score = correctAnswers.size() + "/" + exam.getNumberOfQuestions();
					String date = exam.getCreatedAt().toString();
					String time = exam.getDuration() + " minute";
					return new PracticeHistoryResponse(exam.getId(), title, date, score, time);
				}).toList();

		return response;
	}

	private String generateFeedback(double lastScore) {
		String level;
		if (lastScore < 50) {
			level = "Weak area";
		} else if (lastScore < 80) {
			level = "Needs improvement";
		} else {
			level = "Strong area";
		}
		return String.format("%s – %.0f%% mastery | %s – %.0f%% accuracy", level, lastScore, level, lastScore);
	}
}
