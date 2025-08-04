package com.yach.smartquiz.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.yach.smartquiz.entity.Exam;
import com.yach.smartquiz.entity.ExamStatus;
import com.yach.smartquiz.entity.User;
import com.yach.smartquiz.request.ExamCreateRequest;

@Service
public interface ExamService {

	Exam getExamById(Long id);

	Exam getExamByShortCode(String shortCode);

	void publishExam(String examCode);

	void deleteExamById(Long id);

	Exam createExam(ExamCreateRequest request, boolean isDraft, User user);

	Exam updateExam(Exam exam);

	List<Exam> searchExams(String keyword);

	List<Exam> searchExamsByKeywordAndStatus(String keyword, ExamStatus status);

	List<Exam> getAllExam();

	List<Exam> getAllByStatus(ExamStatus status);

	List<Exam> getActiveExams();

	List<Exam> getCompletedExams();

	List<Exam> searchActiveExams(String keyword);

	List<Exam> searchCompletedExams(String keyword);

}
