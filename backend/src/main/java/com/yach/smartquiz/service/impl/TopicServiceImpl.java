package com.yach.smartquiz.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.yach.smartquiz.custom_exception.NotFoundException;
import com.yach.smartquiz.entity.Chapter;
import com.yach.smartquiz.entity.QuestionType;
import com.yach.smartquiz.entity.Topic;
import com.yach.smartquiz.repository.TopicRepository;
import com.yach.smartquiz.service.TopicService;

@Service
public class TopicServiceImpl implements TopicService {

	private final TopicRepository topicRepository;

	public TopicServiceImpl(TopicRepository topicRepository) {
		super();
		this.topicRepository = topicRepository;
	}

	@Override
	public List<Topic> getByQuestionType(QuestionType type) {
		return topicRepository.findByQuestionType(type);
	}

	@Override
	public List<Topic> getByChapter(Chapter chapter) {
		return topicRepository.findByChapter(chapter);
	}

	@Override
	public Topic createTopic(Topic topic) {
		return topicRepository.save(topic);
	}

	@Override
	public Topic updateTopic(Topic topic) {
		return topicRepository.save(topic);
	}

	@Override
	public void deleteTopicById(Long id) {
		topicRepository.deleteById(id);
	}

	@Override
	public Topic getTopicById(Long id) {
		Optional<Topic> topicOptional = topicRepository.findById(id);
		if (topicOptional.isEmpty()) {
			throw new NotFoundException("Topic Not Found");
		}
		return topicOptional.get();
	}

	@Override
	public List<Topic> getAllTopics() {
		return topicRepository.findAll();
	}

}
