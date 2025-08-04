package com.yach.smartquiz.specification;

import com.yach.smartquiz.entity.Chapter;
import com.yach.smartquiz.entity.Question;
import com.yach.smartquiz.entity.QuestionStatus;
import com.yach.smartquiz.entity.Topic;
import com.yach.smartquiz.entity.User;

import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

public class QuestionSpecification {

	public static Specification<Question> filterByTopicChapterYearKeyword(Topic topic, Chapter chapter, String year,
			String keyword, boolean isMine, User user) {

		return (Root<Question> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
			Predicate predicate = cb.conjunction();

			if (topic != null) {
				predicate = cb.and(predicate, cb.equal(root.get("topic"), topic));
			}

			if (chapter != null) {
				Join<?, ?> topicJoin = root.join("topic");
				predicate = cb.and(predicate, cb.equal(topicJoin.get("chapter"), chapter));
			}

			if (year != null && !year.isEmpty()) {
				predicate = cb.and(predicate, cb.equal(root.get("year"), year));
			}

			if (keyword != null && !keyword.trim().isEmpty()) {
				predicate = cb.and(predicate,
						cb.like(cb.lower(root.get("questionText")), "%" + keyword.toLowerCase() + "%"));
			}
			if (isMine && user != null) {
				predicate = cb.and(predicate, cb.equal(root.get("createdBy"), user));
			} else if (user != null) {
				predicate = cb.and(predicate, cb.equal(root.get("createdBy"), user));
			} else {
				predicate = cb.and(predicate, cb.equal(root.get("status"), QuestionStatus.PUBLISHED));
			}

			return predicate;
		};
	}
}
