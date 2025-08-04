package com.yach.smartquiz.service.impl;

import java.util.*;
import org.springframework.stereotype.Service;

import com.yach.smartquiz.entity.Exam;
import com.yach.smartquiz.entity.UserExam;
import com.yach.smartquiz.repository.ExamRepository;
import com.yach.smartquiz.repository.UserExamRepository;
import com.yach.smartquiz.response.LeaderboardRow;
import com.yach.smartquiz.service.LeaderboardService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LeaderboardServiceImpl implements LeaderboardService {

	private final UserExamRepository userExamRepository;
	private final ExamRepository examRepository;

	@Override
	public List<LeaderboardRow> getGlobalLeaderboard() {
		List<Exam> publicExams = examRepository.findByIsPublicTrue();

		Map<Long, Map<Long, UserExam>> bestAttempts = new HashMap<>();

		for (Exam exam : publicExams) {
			List<UserExam> attempts = userExamRepository.findByExamIdAndExamIsPublicTrue(exam.getId());

			for (UserExam attempt : attempts) {
				if (attempt.getUser() == null || attempt.getScore() == null)
					continue;

				Long userId = attempt.getUser().getId();
				Long examId = exam.getId();

				bestAttempts.putIfAbsent(userId, new HashMap<>());
				Map<Long, UserExam> userBestMap = bestAttempts.get(userId);

				if (!userBestMap.containsKey(examId) || attempt.getScore() > userBestMap.get(examId).getScore()) {
					userBestMap.put(examId, attempt);
				}
			}
		}

		List<LeaderboardRow> leaderboard = new ArrayList<>();

		for (Map.Entry<Long, Map<Long, UserExam>> userEntry : bestAttempts.entrySet()) {
			Map<Long, UserExam> bestExams = userEntry.getValue();

			int examsTaken = bestExams.size();
			double totalPercentage = 0;
			String name = null;
			Long userId = null;

			for (UserExam ue : bestExams.values()) {
				if (ue.getUser() == null || ue.getScore() == null)
					continue;

				name = ue.getUser().getName();
				userId = ue.getUser().getId();
				Exam exam = ue.getExam();
				int totalQuestions = (exam != null && exam.getQuestions() != null) ? exam.getQuestions().size() : 0;

				if (totalQuestions == 0)
					continue;

				double percentage = ((double) ue.getScore() / totalQuestions) * 100.0;
				totalPercentage += percentage;
			}

			double averagePercentage = examsTaken > 0 ? totalPercentage / examsTaken : 0;
			double finalScore = averagePercentage * Math.log(examsTaken + 1);

			LeaderboardRow leaderboardRow = new LeaderboardRow();
			leaderboardRow.setUserId(userId);
			leaderboardRow.setUserName(name);
			leaderboardRow.setAveragePercentage(round(averagePercentage));
			leaderboardRow.setExamsTaken(examsTaken);
			leaderboardRow.setFinalScore(finalScore);
			leaderboard.add(leaderboardRow);
		}

		leaderboard.sort((a, b) -> Double.compare(b.getFinalScore(), a.getFinalScore()));

		long rank = 1;
		for (LeaderboardRow row : leaderboard) {
			row.setRank(rank++);
		}
		return leaderboard;
	}

	private double round(double val) {
		return Math.round(val * 100.0) / 100.0;
	}
}
