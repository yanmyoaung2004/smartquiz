package com.yach.smartquiz.service;

import java.util.List;

import com.yach.smartquiz.response.LeaderboardRow;

import jakarta.transaction.Transactional;

public interface LeaderboardService {

    @Transactional
	public List<LeaderboardRow> getGlobalLeaderboard();
    
}
