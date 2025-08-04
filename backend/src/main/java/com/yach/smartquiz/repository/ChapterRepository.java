package com.yach.smartquiz.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yach.smartquiz.entity.Chapter;
import com.yach.smartquiz.entity.QuestionType;

public interface ChapterRepository extends JpaRepository<Chapter, Long> {

	List<Chapter> findByType(QuestionType type);

}
