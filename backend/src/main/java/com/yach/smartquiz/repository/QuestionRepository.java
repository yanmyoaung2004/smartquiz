package com.yach.smartquiz.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.yach.smartquiz.entity.Question;
import com.yach.smartquiz.entity.QuestionStatus;
import com.yach.smartquiz.entity.QuestionType;
import com.yach.smartquiz.entity.Topic;
import com.yach.smartquiz.entity.User;

import io.lettuce.core.dynamic.annotation.Param;

public interface QuestionRepository extends CrudRepository<Question, Long>, JpaSpecificationExecutor<Question> {

	List<Question> findAllQuestionsByTopic(Topic topic);

	List<Question> findByStatusAndTopic_Chapter_Type(QuestionStatus status, QuestionType type);

	@Query("""
			SELECT q FROM Question q
			WHERE
			    q.topic.chapter.type = :type AND (
			        q.status = :publishedStatus
			        OR (q.status = 'CREATED' AND q.createdBy = :user)
			    )
			""")
	List<Question> findVisibleQuestions(@Param("type") QuestionType type, @Param("user") User user,
			@Param("publishedStatus") QuestionStatus publishedStatus);

	@Query("SELECT q FROM Question q WHERE LOWER(q.questionText) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(q.topic.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
	List<Question> findByQuestionTextOrTopicNameContainingIgnoreCase(String keyword);

	List<Question> findByTopicNameContainingIgnoreCase(String topicName);

	List<Question> findByQuestionTextContainingIgnoreCaseAndStatus(String keyword, QuestionStatus status);

	@Query("SELECT q FROM Question q WHERE (LOWER(q.questionText) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(q.topic.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND q.status = :status")
	List<Question> searchByQuestionTextOrTopicNameAndStatus(String keyword, QuestionStatus status);

	List<Question> findByStatusAndCreatedBy(QuestionStatus status, User createdBy);

	long countByStatusAndCreatedByAndTopic_Chapter_Type(QuestionStatus status, User createdBy, QuestionType type);

	List<Question> findByCreatedBy(User createdBy);

	long countByStatusAndTopic_Chapter_Type(QuestionStatus status, QuestionType type);

	@Query("""
			    SELECT q FROM Question q
			    WHERE q.createdBy = :user
			      AND (
			           LOWER(q.questionText) LIKE LOWER(CONCAT('%', :keyword, '%'))
			           OR LOWER(q.topic.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
			      )
			""")
	List<Question> searchByCreatedByAndKeyword(@Param("user") User user, @Param("keyword") String keyword);

	long countByCreatedByAndTopic_Chapter_Type(User createdBy, QuestionType type);

}
