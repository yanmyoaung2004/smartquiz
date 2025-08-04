package com.yach.smartquiz.service;

import java.util.List;

import com.yach.smartquiz.entity.Chapter;
import com.yach.smartquiz.entity.QuestionType;
import com.yach.smartquiz.entity.Topic;

public interface TopicService {

	Topic createTopic(Topic topic);

	Topic updateTopic(Topic topic);

	void deleteTopicById(Long id);

	Topic getTopicById(Long id);

	List<Topic> getAllTopics();

	List<Topic> getByChapter(Chapter chapter);

	List<Topic> getByQuestionType(QuestionType type);

}
