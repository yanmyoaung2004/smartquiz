package com.yach.smartquiz.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.yach.smartquiz.entity.Chapter;
import com.yach.smartquiz.entity.QuestionType;
import com.yach.smartquiz.entity.Topic;
import com.yach.smartquiz.entity.User;
import com.yach.smartquiz.request.SubjectIdsRequest;
import com.yach.smartquiz.response.ProfileSubjectRequest;
import com.yach.smartquiz.response.dto.ChapterDTO;
import com.yach.smartquiz.response.dto.TopicDTO;
import com.yach.smartquiz.service.ChapterService;
import com.yach.smartquiz.service.QuestionTypeService;
import com.yach.smartquiz.service.TopicService;
import com.yach.smartquiz.service.UserService;

@RestController
@RequestMapping("/api/question-type")
public class QuestionTypeController {

	private final QuestionTypeService questionTypeService;
	private final UserService userService;
	private final ChapterService chapterService;
	private final TopicService topicService;

	public QuestionTypeController(QuestionTypeService questionTypeService, UserService userService,
			ChapterService chapterService, TopicService topicService) {
		super();
		this.questionTypeService = questionTypeService;
		this.userService = userService;
		this.chapterService = chapterService;
		this.topicService = topicService;

	}

	@PostMapping("/create")
	public ResponseEntity<QuestionType> createQuestionType(@RequestBody QuestionType questionType) {
		QuestionType newQuestionType = questionTypeService.createQuestionType(questionType);
		return ResponseEntity.status(HttpStatus.CREATED).body(newQuestionType);
	}

	@DeleteMapping("/delete")
	public ResponseEntity<String> deleteQuestionType(@RequestParam Long questionTypeId) {
		questionTypeService.deleteQuestionTypeById(questionTypeId);
		return ResponseEntity.status(HttpStatus.CREATED).body("Successfully Deleted!");
	}

	@GetMapping("/all")
	public ResponseEntity<Map<String, Object>> getAllQuestionTypes() {
		List<QuestionType> questionTypes = questionTypeService.getAllQuestionTypes();
		List<Chapter> chapters = chapterService.getAllChapters();
		List<Topic> topics = topicService.getAllTopics();
		Map<String, Object> response = new HashMap<>();
		response.put("questionTypes", questionTypes);
		response.put("chapters", chapters);
		response.put("topics", topics);
		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAuthority('QUESTION_CREATE')")
	@GetMapping("/formatted-question-data")
	public ResponseEntity<Map<String, List<?>>> getFormattedQuestionTypesChaptersTopics() {

		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		QuestionType type = user.getUserSettings().getSelectedSubject();

		List<ChapterDTO> chapters = new ArrayList<>();
		List<TopicDTO> allTopics = new ArrayList<>();

		for (Chapter chapter : type.getChapter()) {
			chapters.add(new ChapterDTO(chapter.getId(), type.getName(), chapter.getName()));

			for (Topic topic : chapter.getTopics()) {
				allTopics.add(new TopicDTO(topic.getId(), chapter.getId(), topic.getName()));
			}
		}

		Map<String, List<?>> response = new HashMap<>();
		response.put("chapters", chapters);
		response.put("allTopics", allTopics);

		return ResponseEntity.ok(response);
	}

	@PostMapping("/setup-subject-profile")
	public ResponseEntity<String> setupSubjectProfile(@RequestBody SubjectIdsRequest request) {
		List<Long> subjectIds = request.subjectIds();
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		User existingUser = userService.getUserByEmail(user.getEmail());
		if (existingUser == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
		}
		Set<QuestionType> selectedTypes = new HashSet<>();
		for (Long id : subjectIds) {
			QuestionType questionType = questionTypeService.getQuestionTypeById(id);
			if (questionType == null) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid subject ID: " + id);
			}
			selectedTypes.add(questionType);
		}
		QuestionType defaultType = selectedTypes.stream().findFirst().orElse(null);
		existingUser.getUserSettings().setSelectedSubject(defaultType);
		existingUser.setExamTypes(selectedTypes);
		User updatedUser = userService.updateUser(existingUser);
		if (updatedUser == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User setup failed!");
		}
		return ResponseEntity.ok("User setup succeeded!");
	}

	@PostMapping("/check-setup")
	public ResponseEntity<String> checkProfileSetup(@RequestParam String email) {
		User user = userService.getUserByEmail(email);
		if (user.getExamTypes().size() > 0) {
			return ResponseEntity.status(HttpStatus.OK).body("User has already set up!");
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User hasn't set up!");
	}

	@GetMapping("/get-profile-setup-info")
	public ResponseEntity<List<Long>> checkProfileSetupInfo(@RequestParam String email) {
		User user = userService.getUserByEmail(email);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}

		List<Long> subjectIds = user.getExamTypes().stream().map(QuestionType::getId).toList();

		return ResponseEntity.ok(subjectIds);
	}

	@GetMapping("/get-subjects-and-selected")
	public ResponseEntity<ProfileSubjectRequest> getAllSubjectsAndSelectedOne() {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		User existedUser = userService.getUserByEmail(user.getEmail());
		List<QuestionType> questionTypes = questionTypeService.getAllQuestionTypes();
		if (existedUser == null) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
		}
		QuestionType selectedSubject = user.getUserSettings().getSelectedSubject();
		return ResponseEntity.status(HttpStatus.OK).body(new ProfileSubjectRequest(questionTypes, selectedSubject));
	}

}
