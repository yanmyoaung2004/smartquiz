package com.yach.smartquiz.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.yach.smartquiz.entity.PracticeExam;
import com.yach.smartquiz.entity.Question;
import com.yach.smartquiz.entity.UserAnswer;
import com.yach.smartquiz.entity.UserExam;
import com.yach.smartquiz.entity.UserTopicPerformanceDTO;
import com.yach.smartquiz.entity.UserTopicPerformanceForRecommendationDTO;

public interface UserAnswerRepository extends JpaRepository<UserAnswer, Long> {

	List<UserAnswer> findByPracticeExamAndIsCorrectTrue(PracticeExam practiceExam);

	@Query("SELECT ua FROM UserAnswer ua " + "JOIN FETCH ua.question q " + "LEFT JOIN FETCH q.options "
			+ "WHERE ua.practiceExam = :practiceExam")
	List<UserAnswer> findAnswersWithQuestionAndOptionsByPracticeExam(@Param("practiceExam") PracticeExam practiceExam);

	@Query("SELECT ua FROM UserAnswer ua " + "JOIN FETCH ua.question q " + "LEFT JOIN FETCH q.options "
			+ "WHERE ua.userExam = :userExam")
	List<UserAnswer> findAnswersWithQuestionAndOptionsByUserExam(@Param("userExam") UserExam userExam);

	List<UserAnswer> findByUserExam(UserExam userExam);

	Optional<UserAnswer> findByUserExamAndQuestion(UserExam userExam, Question question);

	@Query(value = """
			WITH latest_attempts AS (
			  SELECT
			    ua.*,
			    COALESCE(ue.user_id, pe.user_id) AS user_id,
			    q.topic_id,
			    ROW_NUMBER() OVER (
			      PARTITION BY ua.question_id
			      ORDER BY ua.created_at DESC
			    ) AS rn
			  FROM user_answer ua
			  LEFT JOIN user_exam ue ON ua.user_exam_id = ue.id
			  LEFT JOIN practice_exam pe ON ua.practice_exam_id = pe.id
			  JOIN questions q ON ua.question_id = q.id
			  JOIN topics t ON q.topic_id = t.id
			  JOIN chapters c ON t.chapter_id = c.id
			  WHERE COALESCE(ue.user_id, pe.user_id) = :userId
			    AND c.type_id = :questionTypeId
			)
			SELECT
			  la.topic_id AS topicId,
			  t.name AS topicName,
			  :userId AS userId,
			  COUNT(la.question_id) AS totalQuestions,
			  SUM(CASE WHEN la.is_correct THEN 1 ELSE 0 END) AS correctCount,
			  ROUND(100.0 * SUM(CASE WHEN la.is_correct THEN 1 ELSE 0 END) / COUNT(la.question_id), 1) AS performanceScore
			FROM latest_attempts la
			JOIN topics t ON la.topic_id = t.id
			WHERE la.rn = 1
			GROUP BY la.topic_id, t.name
			""", nativeQuery = true)
	List<UserTopicPerformanceDTO> findUserTopicPerformance(@Param("userId") Long userId,
			@Param("questionTypeId") Long questionTypeId);

	@Query(value = """
			  WITH latest_attempts AS (
			    SELECT ua.*, COALESCE(ue.user_id, pe.user_id) AS user_id, q.topic_id,
			           ROW_NUMBER() OVER (PARTITION BY ua.question_id ORDER BY ua.created_at DESC) AS rn
			    FROM user_answer ua
			    LEFT JOIN user_exam ue ON ua.user_exam_id = ue.id
			    LEFT JOIN practice_exam pe ON ua.practice_exam_id = pe.id
			    JOIN questions q ON ua.question_id = q.id
			    WHERE COALESCE(ue.user_id, pe.user_id) = :userId
			  )
			  SELECT ROUND(100.0 * SUM(CASE WHEN la.is_correct THEN 1 ELSE 0 END) / COUNT(la.question_id), 1)
			  FROM latest_attempts la
			  WHERE la.rn = 1
			""", nativeQuery = true)
	Double getCurrentOverallScore(@Param("userId") Long userId);

	@Query(value = """
			  WITH previous_attempts AS (
			    SELECT ua.*, COALESCE(ue.user_id, pe.user_id) AS user_id, q.topic_id,
			           ROW_NUMBER() OVER (PARTITION BY ua.question_id ORDER BY ua.created_at DESC) AS rn
			    FROM user_answer ua
			    LEFT JOIN user_exam ue ON ua.user_exam_id = ue.id
			    LEFT JOIN practice_exam pe ON ua.practice_exam_id = pe.id
			    JOIN questions q ON ua.question_id = q.id
			    WHERE COALESCE(ue.user_id, pe.user_id) = :userId
			      AND ua.created_at < :startOfThisMonth
			  )
			  SELECT ROUND(100.0 * SUM(CASE WHEN pa.is_correct THEN 1 ELSE 0 END) / COUNT(pa.question_id), 1)
			  FROM previous_attempts pa
			  WHERE pa.rn = 1
			""", nativeQuery = true)
	Double getPreviousMonthOverallScore(@Param("userId") Long userId,
			@Param("startOfThisMonth") LocalDateTime startOfThisMonth);

	@Query(value = """
			WITH latest_attempts AS (
			  SELECT
			    ua.*,
			    COALESCE(ue.user_id, pe.user_id) AS user_id,
			    q.topic_id,
			    ROW_NUMBER() OVER (
			      PARTITION BY ua.question_id
			      ORDER BY ua.created_at DESC
			    ) AS rn
			  FROM user_answer ua
			  LEFT JOIN user_exam ue ON ua.user_exam_id = ue.id
			  LEFT JOIN practice_exam pe ON ua.practice_exam_id = pe.id
			  JOIN questions q ON ua.question_id = q.id
			  JOIN topics t ON q.topic_id = t.id
			  JOIN chapters c ON t.chapter_id = c.id
			  WHERE COALESCE(ue.user_id, pe.user_id) = :userId
			    AND c.type_id = :questionTypeId
			)
			SELECT
			  la.topic_id AS topicId,
			  t.name AS topicName,
			  :userId AS userId,
			  COUNT(la.question_id) AS totalQuestions,
			  SUM(CASE WHEN la.is_correct THEN 1 ELSE 0 END) AS correctCount,
			  ROUND(100.0 * SUM(CASE WHEN la.is_correct THEN 1 ELSE 0 END) / COUNT(la.question_id), 1) AS lastScore,
			  COUNT(DISTINCT la.user_exam_id) + COUNT(DISTINCT la.practice_exam_id) AS numAttempts
			FROM latest_attempts la
			JOIN topics t ON la.topic_id = t.id
			WHERE la.rn = 1
			GROUP BY la.topic_id, t.name
			""", nativeQuery = true)
	List<UserTopicPerformanceForRecommendationDTO> findUserTopicPerformanceForRecommendation(
			@Param("userId") Long userId, @Param("questionTypeId") Long questionTypeId);

}
