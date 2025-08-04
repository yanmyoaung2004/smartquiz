package com.yach.smartquiz.service;

import java.util.List;

import com.yach.smartquiz.entity.Exam;
import com.yach.smartquiz.entity.ExamInvitation;
import com.yach.smartquiz.entity.User;
import com.yach.smartquiz.entity.UserExam;

public interface UserExamService {

	UserExam createUserExam(UserExam userExam);

	boolean existsByUserAndExam(User user, Exam exam);

	UserExam getUserExamByUserAndExam(User user, Exam exam);

	UserExam getUserExamByGuestUserAndExam(ExamInvitation guestUser, Exam exam);

	List<UserExam> getAllUserExamByExam(Exam exam);

	UserExam saveUserExam(UserExam userExam);
	
	List<UserExam> getUserExamByUser(User user);
	
	List<UserExam> getUserExam();

}
