package com.yach.smartquiz.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.yach.smartquiz.entity.Chapter;
import com.yach.smartquiz.entity.QuestionType;
import com.yach.smartquiz.entity.Topic;

import io.lettuce.core.dynamic.annotation.Param;

public interface TopicRepository extends JpaRepository<Topic, Long> {

    List<Topic> findByChapter(Chapter chapter);

    @Query("SELECT t FROM Topic t WHERE t.chapter.type = :type")
    List<Topic> findByQuestionType(@Param("type") QuestionType type);

}
