package com.yach.smartquiz.service;

import java.util.List;

import com.yach.smartquiz.entity.Exam;
import com.yach.smartquiz.entity.ExamInvitation;

public interface ExamInvitationService {

	ExamInvitation getByToken(String token);

	ExamInvitation getByEmailAndExam(String email, Exam exam);

	ExamInvitation getByEmailAndExamWithNullReturn(String email, Exam exam);

	List<ExamInvitation> getByEmail(String email);

	ExamInvitation saveInvitation(ExamInvitation invitation);
	
    List<ExamInvitation> findByExam(Exam exam);

}
