package com.yach.smartquiz.service;

import java.util.List;

import com.yach.smartquiz.entity.Chapter;
import com.yach.smartquiz.entity.QuestionType;

public interface ChapterService {

	Chapter createChapter(Chapter chapter);

	Chapter updateChapter(Chapter chapter);

    void deleteChapterById(Long id);

    Chapter getChapterById(Long id);

    List<Chapter> getAllChapters();
    
    List<Chapter> getByQuestionType(QuestionType type);
}
