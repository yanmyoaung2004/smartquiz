package com.yach.smartquiz.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yach.smartquiz.entity.Exam;
import com.yach.smartquiz.entity.ExamInvitation;
import com.yach.smartquiz.entity.User;
import com.yach.smartquiz.entity.UserExam;

public interface UserExamRepository extends JpaRepository<UserExam, Long> {

	boolean existsByUserAndExam(User user, Exam exam);

	Optional<UserExam> findByUserAndExam(User user, Exam exam);

	Optional<UserExam> findByGuestUserAndExam(ExamInvitation guestUser, Exam exam);

	List<UserExam> findByExamOrderByIdDesc(Exam exam);

	List<UserExam> findByUser(User user);

	List<UserExam> findByExamIdAndExamIsPublicTrue(Long examId);

}
