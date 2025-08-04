package com.yach.smartquiz.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.yach.smartquiz.entity.Exam;
import com.yach.smartquiz.entity.ExamStatus;

import io.lettuce.core.dynamic.annotation.Param;

public interface ExamRepository extends CrudRepository<Exam, Long> {

	List<Exam> findByIsPublicTrue();

	Optional<Exam> findByShortCode(String shortCode);

	List<Exam> findByStatus(ExamStatus status);

	List<Exam> findByStatusNot(ExamStatus status);

	@Query("SELECT e FROM Exam e WHERE e.startDate <= :now AND e.endDate >= :now")
	List<Exam> findActiveExams(@Param("now") LocalDateTime now);

	@Query("SELECT e FROM Exam e WHERE e.endDate < :now")
	List<Exam> findCompletedExams(@Param("now") LocalDateTime now);

	@Query("SELECT e FROM Exam e " + "WHERE e.startDate <= :now AND e.endDate >= :now "
			+ "AND (LOWER(e.name) LIKE LOWER(CONCAT('%', :keyword, '%')) "
			+ "OR LOWER(e.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
	List<Exam> searchActiveExamsByKeyword(@Param("now") LocalDateTime now, @Param("keyword") String keyword);

	@Query("SELECT e FROM Exam e " + "WHERE e.endDate < :now "
			+ "AND (LOWER(e.name) LIKE LOWER(CONCAT('%', :keyword, '%')) "
			+ "OR LOWER(e.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
	List<Exam> searchCompletedExamsByKeyword(@Param("now") LocalDateTime now, @Param("keyword") String keyword);

	@Query("SELECT e FROM Exam e WHERE LOWER(e.name) LIKE LOWER(CONCAT('%', :keyword, '%')) "
			+ "OR LOWER(e.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
	List<Exam> searchByNameOrDescription(@Param("keyword") String keyword);

	@Query("SELECT e FROM Exam e " + "WHERE (LOWER(e.name) LIKE LOWER(CONCAT('%', :keyword, '%')) "
			+ "   OR LOWER(e.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) "
			+ "AND (:status IS NULL OR e.status = :status)")
	List<Exam> searchByKeywordAndStatus(@Param("keyword") String keyword, @Param("status") ExamStatus status);

}
