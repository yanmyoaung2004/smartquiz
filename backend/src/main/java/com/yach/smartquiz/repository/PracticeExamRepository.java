package com.yach.smartquiz.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yach.smartquiz.entity.PracticeExam;
import com.yach.smartquiz.entity.User;

public interface PracticeExamRepository extends JpaRepository<PracticeExam, Long> {

	Optional<PracticeExam> findByShortCode(String shortCode);
	
	List<PracticeExam> findByUser(User user);
}
