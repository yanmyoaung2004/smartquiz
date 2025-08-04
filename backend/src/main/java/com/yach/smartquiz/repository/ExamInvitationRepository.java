package com.yach.smartquiz.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.yach.smartquiz.entity.Exam;
import com.yach.smartquiz.entity.ExamInvitation;

public interface ExamInvitationRepository extends JpaRepository<ExamInvitation, Long> {
	Optional<ExamInvitation> findByInvitationToken(String invitationToken);

	Optional<ExamInvitation> findByEmail(String email);

	Optional<ExamInvitation> findByEmailAndExam(String email, Exam exam);

	List<ExamInvitation> findByExam(Exam exam);

	@Query("SELECT ei FROM ExamInvitation ei WHERE ei.email = :email")
	List<ExamInvitation> findExamsByEmail(@Param("email") String email);

}
