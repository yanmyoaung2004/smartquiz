package com.yach.smartquiz.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.yach.smartquiz.entity.Chapter;
import com.yach.smartquiz.entity.QuestionType;
import com.yach.smartquiz.entity.User;
import com.yach.smartquiz.service.ChapterService;

@RestController
@RequestMapping("/api/chapter")
public class ChapterController {

	private final ChapterService chapterService;

	public ChapterController(ChapterService chapterService) {
		super();
		this.chapterService = chapterService;
	}

	@PostMapping("/create")
	public ResponseEntity<Chapter> createChapter(@RequestBody Chapter chapter) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		QuestionType questionType = user.getUserSettings().getSelectedSubject();
		chapter.setType(questionType);
		Chapter newChapter = chapterService.createChapter(chapter);
		return ResponseEntity.status(HttpStatus.CREATED).body(newChapter);
	}
	
	@DeleteMapping("/delete")
	public ResponseEntity<String> deleteChapter(@RequestParam Long chapterId) {
		chapterService.deleteChapterById(chapterId);
		return ResponseEntity.status(HttpStatus.CREATED).body("Successfully Deleted!");
	}


	@GetMapping("/get/{id}")
	public ResponseEntity<Chapter> getChapterById(@PathVariable Long id) {
		Chapter chapter = chapterService.getChapterById(id);
		return ResponseEntity.ok(chapter);
	}

	@GetMapping("all")
	public ResponseEntity<List<Chapter>> getAllChapters() {
		List<Chapter> chapters = chapterService.getAllChapters();
		return ResponseEntity.ok(chapters);
	}
}
