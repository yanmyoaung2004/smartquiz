package com.yach.smartquiz.controller;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.apache.poi.openxml4j.util.ZipSecureFile;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DataValidation;
import org.apache.poi.ss.usermodel.DataValidationConstraint;
import org.apache.poi.ss.usermodel.DataValidationHelper;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Name;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.util.CellRangeAddressList;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.yach.smartquiz.custom_exception.ForbiddenAccessException;
import com.yach.smartquiz.entity.Chapter;
import com.yach.smartquiz.entity.Exam;
import com.yach.smartquiz.entity.Option;
import com.yach.smartquiz.entity.Question;
import com.yach.smartquiz.entity.QuestionStatus;
import com.yach.smartquiz.entity.QuestionType;
import com.yach.smartquiz.entity.Topic;
import com.yach.smartquiz.entity.User;
import com.yach.smartquiz.request.CreateQuestionRequest;
import com.yach.smartquiz.response.ExamCreationQuestionResponse;
import com.yach.smartquiz.response.OptionResponse;
import com.yach.smartquiz.response.PaginatedResponse;
import com.yach.smartquiz.response.QuestionListResponse;
import com.yach.smartquiz.response.TopicChapterAndYearListForExamResponse;
import com.yach.smartquiz.service.ChapterService;
import com.yach.smartquiz.service.ExamService;
import com.yach.smartquiz.service.QuestionService;
import com.yach.smartquiz.service.TopicService;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("api/question")
public class QuestionController {

	private final QuestionService questionService;
	private final TopicService topicService;
	private final ChapterService chapterService;
	private final ExamService examService;

	public QuestionController(QuestionService questionService, TopicService topicService, ChapterService chapterService,
			ExamService examService) {
		super();
		this.questionService = questionService;
		this.topicService = topicService;
		this.chapterService = chapterService;
		this.examService = examService;
	}

	@PreAuthorize("hasAuthority('QUESTION_CREATE')")
	@PostMapping("/create")
	public ResponseEntity<Question> createQuestion(@RequestBody CreateQuestionRequest request) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Question question = request.question();
		question.setCreatedBy(user);
		Long topicId = request.topicId();
		Topic topic = topicService.getTopicById(topicId);
		question.setTopic(topic);
		if (question.getImageUrl() == "") {
			question.setImageUrl(null);
		}
		Question createdQuestion = questionService.createQuestion(question, request.correctOptionIndex());
		return ResponseEntity.status(HttpStatus.CREATED).body(createdQuestion);
	}
	
	@DeleteMapping("/delete")
	public ResponseEntity<String> deleteChapter(@RequestParam Long questionId) {
		questionService.deleteQuestionById(questionId);
		return ResponseEntity.status(HttpStatus.CREATED).body("Successfully Deleted!");
	}


	@PreAuthorize("hasAuthority('QUESTION_UPDATE')")
	@PostMapping("/update")
	public ResponseEntity<Question> updateQuestion(@RequestBody CreateQuestionRequest request) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Question existedQuestion = questionService.getQuestionById(request.question().getId());
		if (user.getId() != existedQuestion.getCreatedBy().getId()) {
			throw new ForbiddenAccessException("You don't have permission to edit!");
		}
		Question question = request.question();
		question.setCreatedBy(user);
		question.setCreated_at(existedQuestion.getCreated_at());
		question.setStatus(existedQuestion.getStatus());
		if (question.getImageUrl() == "") {
			question.setImageUrl(null);
		}
		Long topicId = request.topicId();
		Topic topic = topicService.getTopicById(topicId);
		question.setTopic(topic);
		Question createdQuestion = questionService.createQuestion(question, request.correctOptionIndex());
		return ResponseEntity.status(HttpStatus.CREATED).body(createdQuestion);
	}

	@DeleteMapping("/delete/{questionId}")
	public ResponseEntity<String> deleteQuestion(@PathVariable Long questionId) {
		questionService.deleteQuestionById(questionId);
		return ResponseEntity.ok("Successfully deleted!");
	}

	@PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
	@GetMapping("/get-by-chapter/{chapterId}")
	public ResponseEntity<List<Question>> getAllQuestionByChapter(@PathVariable Long chapterId) {
		Chapter chapter = chapterService.getChapterById(chapterId);
		List<Question> questions = new ArrayList<>();
		if (chapter != null) {
			for (Topic topic : chapter.getTopics()) {
				questions.addAll(questionService.getAllQuestionByTopic(topic));
			}
			return ResponseEntity.ok(questions);
		}
		return ResponseEntity.badRequest().body(questions);
	}

	@PreAuthorize("hasAuthority('EXAM_CREATE')")
	@GetMapping("/get/exam-creation")
	public ResponseEntity<PaginatedResponse<ExamCreationQuestionResponse>> getExamCreationQuestions(
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size,
			@RequestParam(required = false) Long topicId, @RequestParam(required = false) Long chapterId,
			@RequestParam(required = false) String year, @RequestParam(required = false) String keyword,
			@RequestParam(required = false) boolean isMine) {
		Topic topic = null;
		Chapter chapter = null;
		if (topicId != null) {
			topic = topicService.getTopicById(topicId);
		}
		if (chapterId != null) {
			chapter = chapterService.getChapterById(chapterId);
		}
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		List<Question> questions = questionService.getFilteredQuestions(topic, chapter, year, keyword, isMine, user);
		QuestionType type = user.getUserSettings().getSelectedSubject();
		List<ExamCreationQuestionResponse> filteredQuestions = mapToExamCreationResponses(questions, type, user);
		int total = filteredQuestions.size();
		int start = page * size;
		int end = Math.min(start + size, total);
		if (start > end) {
			return ResponseEntity.ok(new PaginatedResponse<>(Collections.emptyList(), page, size, total));
		}
		List<ExamCreationQuestionResponse> pagedQuestions = filteredQuestions.subList(start, end);
		PaginatedResponse<ExamCreationQuestionResponse> response = new PaginatedResponse<>(pagedQuestions, page, size,
				total);
		return ResponseEntity.ok(response);
	}

	private List<ExamCreationQuestionResponse> mapToExamCreationResponses(List<Question> questions, QuestionType type,
			User user) {
		return questions.stream().filter(q -> q.getTopic().getChapter().getType().getId().equals(type.getId())
				&& (q.getStatus().equals(QuestionStatus.PUBLISHED) || q.getCreatedBy().getId().equals(user.getId())))
				.sorted(Comparator.comparing(Question::getCreated_at).reversed())
				.map(this::convertToExamCreationResponse).toList();
	}

	@PreAuthorize("hasAuthority('EXAM_CREATE')")
	@GetMapping("/get-selected-question")
	public ResponseEntity<List<Long>> getExamSelectedQuestions(@RequestParam String examCode) {
		Exam exam = examService.getExamByShortCode(examCode);
		List<Long> selectedQuestions = exam.getQuestions().stream().map(Question::getId).collect(Collectors.toList());
		return ResponseEntity.ok(selectedQuestions);
	}

	private ExamCreationQuestionResponse convertToExamCreationResponse(Question question) {
		String topicName = question.getTopic() != null ? question.getTopic().getName() : "Unknown Topic";
		String chapterName = (question.getTopic() != null && question.getTopic().getChapter() != null)
				? question.getTopic().getChapter().getName()
				: "Unknown Chapter";
		boolean hasNoImage = question.getImageUrl() == null;
		return new ExamCreationQuestionResponse(question.getId(), question.getQuestionText(), topicName, chapterName,
				question.getYear(), hasNoImage, false);
	}

	private List<Question> getAllFilteredQuestions(String keyword, QuestionStatus status, User user,
			QuestionType defaultType) {
		boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();
		boolean hasStatus = status != null;

		boolean isMine = hasStatus && status == QuestionStatus.MINE;
		boolean isHasImage = hasStatus && status == QuestionStatus.HAS_IMAGE;

		if (hasKeyword && isMine) {
			return questionService.searchByCreatedByAndKeyword(keyword, user);
		}
		if (hasKeyword && isHasImage) {
			return questionService.getQuestionsWithImagesByKeyword(keyword);
		}
		if (hasKeyword && hasStatus) {
			return questionService.searchByQuestionTextOrTopicNameAndStatus(keyword, status);
		}
		if (hasKeyword) {
			return questionService.getByQuestionTextOrTopicNameContainingIgnoreCase(keyword);
		}
		if (isMine) {
			return questionService.getByCreatedBy(user);
		}
		if (isHasImage) {
			return questionService.getQuestionsWithImages();
		}
		if (hasStatus) {
			return questionService.getAllQuestionsByStatus(status, defaultType);
		}
		return questionService.findQuestions(QuestionStatus.PUBLISHED, defaultType, user);
	}

	@PreAuthorize("hasAuthority('QUESTION_VIEW')")
	@GetMapping("/all")
	public ResponseEntity<PaginatedResponse<QuestionListResponse>> getAllQuestionsList(
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size,
			@RequestParam(required = false) String keyword, @RequestParam(required = false) QuestionStatus status) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		QuestionType defaultQuestionType = user.getUserSettings().getSelectedSubject();
		List<Question> questions = this.getAllFilteredQuestions(keyword, status, user, defaultQuestionType);
		List<QuestionListResponse> allQuestions = questions.stream()
				.filter(q -> q.getTopic().getChapter().getType().getId().equals(defaultQuestionType.getId()))
				.sorted(Comparator.comparing(Question::getCreated_at).reversed())
				.map(q -> new QuestionListResponse(q.getId(), q.getCreatedBy().getEmail(), q.getStatus().toString(),
						q.getQuestionText(), q.getImageUrl() != null || q.getImageUrl() == "", q.getImageUrl(),
						q.getTopic().getChapter().getName(), q.getTopic().getName(), q.getYear(),
						q.getCreated_at().toString(), q.getUpdated_at().toString(), q.getExplanation(),
						q.getOptions().stream()
								.map(o -> new OptionResponse(o.getId(), o.getOptionText(),
										o.getImageUrl() != null || o.getImageUrl() == "", o.getImageUrl(),
										"Option Image", q.getCorrectOption().getId() == o.getId()))
								.collect(Collectors.toList())))
				.collect(Collectors.toList());
		int total = allQuestions.size();
		int start = page * size;
		int end = Math.min(start + size, total);
		if (start > end) {
			return ResponseEntity.ok(new PaginatedResponse<>(Collections.emptyList(), page, size, total));
		}
		List<Question> allPublishedQuestion = questionService.getAllQuestionsByStatus(QuestionStatus.PUBLISHED,
				defaultQuestionType);
		long allPublishedQuestionsCount = questionService.getAllQuestionsCountByStatus(QuestionStatus.PUBLISHED,
				defaultQuestionType);
		long myPublishedQuestionCount = questionService.findCountByStatusAndCreatedBy(QuestionStatus.PUBLISHED, user,
				defaultQuestionType);
		long myCreatedQuestionCount = questionService.countByCreatedBy(user, defaultQuestionType);
		long questionWithImage = allPublishedQuestion.stream()
				.filter(q -> q.getImageUrl() != null && !q.getImageUrl().isEmpty()).count();
		List<QuestionListResponse> pagedQuestions = allQuestions.subList(start, end);
		Map<String, Object> credentialResponse = new HashMap<>();
		credentialResponse.put("totalQuestions", allPublishedQuestionsCount);
		credentialResponse.put("publishedQuestions", myPublishedQuestionCount);
		credentialResponse.put("createdQuestions", myCreatedQuestionCount);
		credentialResponse.put("questionWithImage", questionWithImage);
		PaginatedResponse<QuestionListResponse> response = new PaginatedResponse<>(pagedQuestions, credentialResponse,
				page, size, total);

		return ResponseEntity.ok(response);
	}

	@GetMapping("/get-topic-chapter-year")
	public ResponseEntity<TopicChapterAndYearListForExamResponse> getTopicChapterAndYearForExamCreation() {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		QuestionType selectedType = user.getUserSettings().getSelectedSubject();
		List<Chapter> chapters = chapterService.getByQuestionType(selectedType);
		List<Topic> topics = chapters.stream().flatMap(chapter -> topicService.getByChapter(chapter).stream())
				.collect(Collectors.toList());
		List<Question> questions = questionService.findQuestions(QuestionStatus.PUBLISHED, selectedType, user);
		List<String> years = questions.stream().map(Question::getYear).filter(Objects::nonNull).distinct()
				.sorted(Comparator.comparingInt(Integer::parseInt)).collect(Collectors.toList());

		TopicChapterAndYearListForExamResponse response = new TopicChapterAndYearListForExamResponse(chapters, topics,
				years);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/question-template")
	public void downloadQuestionTemplate(HttpServletResponse response) throws IOException {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		QuestionType type = user.getUserSettings().getSelectedSubject();
		List<Chapter> chapters = chapterService.getByQuestionType(type);

		Map<String, List<String>> chapterToTopicsMap = new LinkedHashMap<>();
		List<String> chapterList = new ArrayList<>();

		for (Chapter chapter : chapters) {
			String chapterName = chapter.getName();
			chapterList.add(chapterName);

			List<Topic> topics = topicService.getByChapter(chapter);
			List<String> topicNames = topics.stream().map(Topic::getName).collect(Collectors.toList());
			chapterToTopicsMap.put(chapterName, topicNames);
		}

		XSSFWorkbook workbook = new XSSFWorkbook();
		XSSFSheet sheet = workbook.createSheet("Question Template");
		List<String> headers = new ArrayList<>(List.of("Question Text", "Year", "Explanation", "Question Image URL"));
		char optionLabel = 'A';
		for (int i = 0; i < 4; i++) {
			headers.add("Option " + optionLabel);
			headers.add("Option " + optionLabel + " Image URL");
			optionLabel++;
		}
		headers.add("Correct Option");
		headers.add("Chapter");
		headers.add("Topic");
		Row headerRow = sheet.createRow(0);
		CellStyle headerStyle = workbook.createCellStyle();
		Font font = workbook.createFont();
		font.setBold(true);
		headerStyle.setFont(font);
		headerStyle.setLocked(true);

		for (int i = 0; i < headers.size(); i++) {
			Cell cell = headerRow.createCell(i);
			cell.setCellValue(headers.get(i));
			cell.setCellStyle(headerStyle);
			sheet.setColumnWidth(i, 5000);
		}
		XSSFSheet hiddenSheet = workbook.createSheet("DropdownData");
		workbook.setSheetHidden(workbook.getSheetIndex(hiddenSheet), true);
		String[] correctOptionValues = { "A", "B", "C", "D" };
		for (int i = 0; i < correctOptionValues.length; i++) {
			Row row = hiddenSheet.getRow(i);
			if (row == null)
				row = hiddenSheet.createRow(i);
			row.createCell(0).setCellValue(correctOptionValues[i]);
		}

		for (int i = 0; i < chapterList.size(); i++) {
			Row row = hiddenSheet.getRow(i);
			if (row == null)
				row = hiddenSheet.createRow(i);
			row.createCell(1).setCellValue(chapterList.get(i));
		}
		Name correctOptName = workbook.createName();
		correctOptName.setNameName("CorrectOptionList");
		correctOptName.setRefersToFormula("DropdownData!$A$1:$A$4");
		Name chapterName = workbook.createName();
		chapterName.setNameName("ChapterList");
		chapterName.setRefersToFormula("DropdownData!$B$1:$B$" + chapterList.size());
		int topicStartCol = 2;
		int topicColOffset = 0;
		for (Map.Entry<String, List<String>> entry : chapterToTopicsMap.entrySet()) {
			String chapter = entry.getKey();
			String sanitizedChapterName = chapter.replaceAll("\\s+", "_");

			List<String> topicNames = entry.getValue();
			for (int i = 0; i < topicNames.size(); i++) {
				Row row = hiddenSheet.getRow(i);
				if (row == null)
					row = hiddenSheet.createRow(i);
				row.createCell(topicStartCol + topicColOffset).setCellValue(topicNames.get(i));
			}
			char colLetter = (char) ('A' + topicStartCol + topicColOffset);
			String range = "DropdownData!$" + colLetter + "$1:$" + colLetter + "$" + topicNames.size();

			Name name = workbook.createName();
			name.setNameName(sanitizedChapterName);
			name.setRefersToFormula(range);

			topicColOffset++;
		}

		DataValidationHelper dvHelper = sheet.getDataValidationHelper();
		int correctOptionCol = headers.indexOf("Correct Option");
		CellRangeAddressList correctRange = new CellRangeAddressList(1, 1000, correctOptionCol, correctOptionCol);
		DataValidationConstraint correctConstraint = dvHelper.createFormulaListConstraint("CorrectOptionList");
		DataValidation correctValidation = dvHelper.createValidation(correctConstraint, correctRange);
		correctValidation.setShowErrorBox(true);
		sheet.addValidationData(correctValidation);
		int chapterCol = headers.indexOf("Chapter");
		CellRangeAddressList chapterRange = new CellRangeAddressList(1, 1000, chapterCol, chapterCol);
		DataValidationConstraint chapterConstraint = dvHelper.createFormulaListConstraint("ChapterList");
		DataValidation chapterValidation = dvHelper.createValidation(chapterConstraint, chapterRange);
		chapterValidation.setShowErrorBox(true);
		sheet.addValidationData(chapterValidation);
		int topicCol = headers.indexOf("Topic");
		CellRangeAddressList topicRange = new CellRangeAddressList(1, 1000, topicCol, topicCol);
		String formula = "INDIRECT(SUBSTITUTE(INDIRECT(ADDRESS(ROW(), " + (chapterCol + 1) + ")),\" \",\"_\"))";
		DataValidationConstraint topicConstraint = dvHelper.createFormulaListConstraint(formula);
		DataValidation topicValidation = dvHelper.createValidation(topicConstraint, topicRange);
		topicValidation.setShowErrorBox(true);
		sheet.addValidationData(topicValidation);
		sheet.protectSheet("lock");
		for (int r = 1; r <= 1000; r++) {
			Row row = sheet.createRow(r);
			for (int c = 0; c < headers.size(); c++) {
				Cell cell = row.createCell(c);
				CellStyle unlockedStyle = workbook.createCellStyle();
				unlockedStyle.setLocked(false);
				cell.setCellStyle(unlockedStyle);
			}
		}

		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		response.setHeader("Content-Disposition", "attachment; filename=dynamic_question_template.xlsx");
		workbook.write(response.getOutputStream());
		workbook.close();
	}

	@PostMapping("/import-questions")
	public ResponseEntity<String> importQuestions(@RequestParam("file") MultipartFile file) {
		if (file.isEmpty() || !file.getOriginalFilename().endsWith(".xlsx")) {
			return ResponseEntity.badRequest().body("Invalid file format. Please upload a .xlsx file.");
		}

		try {
			ZipSecureFile.setMinInflateRatio(0.001);
			try (InputStream is = file.getInputStream(); XSSFWorkbook workbook = new XSSFWorkbook(is)) {
				XSSFSheet sheet = workbook.getSheet("Question Template");
				if (sheet == null) {
					return ResponseEntity.badRequest().body("Missing 'Question Template' sheet.");
				}
				Map<String, Chapter> chapterMap = chapterService.getAllChapters().stream()
						.collect(Collectors.toMap(Chapter::getName, c -> c, (c1, c2) -> c1));
				Map<String, Topic> topicMap = topicService.getAllTopics().stream()
						.collect(Collectors.toMap(Topic::getName, t -> t, (t1, t2) -> t1));
				List<Question> importedQuestions = new ArrayList<>();
				int rowNum = 1;
				while (true) {
					Row row = sheet.getRow(rowNum++);
					if (row == null)
						break;
					if (isRowEmpty(row))
						continue;
					try {
						String questionText = getStringValue(row, 0);
						String year = getStringValue(row, 1);
						String explanation = getStringValue(row, 2);
						String questionImage = getStringValue(row, 3);
						List<Option> options = new ArrayList<>();

						String correctLetter = getStringValue(row, 12);
						Option correctOption = null;

						char label = 'A';
						for (int i = 4; i <= 10; i += 2) {
							String optionText = getStringValue(row, i);
							String optionImage = getStringValue(row, i + 1);

							if (optionText != null && !optionText.isBlank()) {
								Option option = new Option();
								option.setOptionText(optionText);
								option.setImageUrl(optionImage);
								options.add(option);
								if (String.valueOf(label).equalsIgnoreCase(correctLetter)) {
									correctOption = option;
								}
							}
							label++;
						}

						if (correctOption == null) {
							return ResponseEntity.badRequest().body("Invalid correct option at row " + rowNum);
						}
						
						String chapterName = getStringValue(row, 13);
						String topicName = getStringValue(row, 14);

						if (questionText == null || correctOption == null || chapterName == null || topicName == null) {
							return ResponseEntity.badRequest().body("Missing required fields at row " + rowNum);
						}

						Chapter chapter = chapterMap.get(chapterName);
						Topic topic = topicMap.get(topicName);

						if (chapter == null || topic == null) {
							return ResponseEntity.badRequest().body("Invalid Chapter or Topic at row " + rowNum);
						}
						User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
						Question question = new Question();
						question.setCreatedBy(user);
						question.setQuestionText(questionText);
						question.setYear(year);
						question.setImageUrl(questionImage);
						question.setExplanation(explanation);
						question.setTopic(topic);
						question.setCorrectOption(correctOption);
						question.setOptions(options);
						importedQuestions.add(question);

					} catch (Exception rowEx) {
						return ResponseEntity.badRequest()
								.body("Error parsing row " + rowNum + ": " + rowEx.getMessage());
					}
				}

//				List<Question> questions = questionService.createQuestionWithImport(importedQuestions);
				return ResponseEntity.ok("Successfully imported " + importedQuestions.size() + " questions.");
			}

		} catch (IOException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error reading Excel file: " + e.getMessage());
		}
	}

	private String getStringValue(Row row, int cellIndex) {
		Cell cell = row.getCell(cellIndex, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
		return cell.getCellType() == CellType.STRING ? cell.getStringCellValue().trim()
				: cell.getCellType() == CellType.NUMERIC ? String.valueOf((int) cell.getNumericCellValue()) : null;
	}

	private boolean isRowEmpty(Row row) {
		for (int c = 0; c < row.getLastCellNum(); c++) {
			if (row.getCell(c) != null && row.getCell(c).getCellType() != CellType.BLANK) {
				return false;
			}
		}
		return true;
	}
	
	@GetMapping("/publish")
	public ResponseEntity<String> publishQuestion(@RequestParam Long questionId){
		Question question = questionService.getQuestionById(questionId);
		question.setStatus(QuestionStatus.PUBLISHED);
		questionService.updateQuestion(question);
		return ResponseEntity.ok("Successfully updated!");
	}

}
