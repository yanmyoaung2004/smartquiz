package com.yach.smartquiz.service;


import java.util.List;

import com.yach.smartquiz.entity.PracticeExam;
import com.yach.smartquiz.entity.User;

public interface PracticeExamService {
	
	PracticeExam createPracticeExam(PracticeExam practiceExam);
	
	PracticeExam getPracticeExamByShortCode(String shortCode);
	
	List<PracticeExam> getByUser(User user);
	
	List<PracticeExam> getAll();

}
