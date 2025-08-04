
package com.yach.smartquiz.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.yach.smartquiz.custom_exception.NotFoundException;
import com.yach.smartquiz.entity.Chapter;
import com.yach.smartquiz.entity.QuestionType;
import com.yach.smartquiz.repository.ChapterRepository;
import com.yach.smartquiz.service.ChapterService;

@Service
public class ChapterServiceImpl implements ChapterService {

	private final ChapterRepository chapterRepository;

	public ChapterServiceImpl(ChapterRepository chapterRepository) {
		super();
		this.chapterRepository = chapterRepository;
	}

	@Override
	public List<Chapter> getByQuestionType(QuestionType type) {
		return chapterRepository.findByType(type);
	}

	@Override
	public Chapter createChapter(Chapter chapter) {
		return chapterRepository.save(chapter);

	}

	@Override
	public Chapter updateChapter(Chapter chapter) {
		return chapterRepository.save(chapter);
	}

	@Override
	public void deleteChapterById(Long id) {
		Optional<Chapter> chapterOpt = chapterRepository.findById(id);
		if (chapterOpt.isEmpty()) {
			throw new NotFoundException("Chapter Not Found!");
		}
		chapterRepository.deleteById(id);

	}

	@Override
	public Chapter getChapterById(Long id) {
		Optional<Chapter> chapterOpt = chapterRepository.findById(id);
		if (chapterOpt.isEmpty()) {
			throw new NotFoundException("Chapter Not Found!");
		}
		return chapterOpt.get();
	}

	@Override
	public List<Chapter> getAllChapters() {
		return chapterRepository.findAll();
	}
}
