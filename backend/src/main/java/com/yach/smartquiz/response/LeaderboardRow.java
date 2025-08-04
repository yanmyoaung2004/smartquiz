package com.yach.smartquiz.response;

public class LeaderboardRow {

    private Long userId;
    private Long rank;
    private String userName;
    private double averagePercentage;
    private int examsTaken;
    private double finalScore;

    public LeaderboardRow() {
    }

    public LeaderboardRow(Long userId, Long rank, String userName, double averagePercentage, int examsTaken, double finalScore) {
        this.userId = userId;
        this.rank = rank;
        this.userName = userName;
        this.averagePercentage = averagePercentage;
        this.examsTaken = examsTaken;
        this.finalScore = finalScore;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getRank() {
        return rank;
    }

    public void setRank(Long rank) {
        this.rank = rank;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public double getAveragePercentage() {
        return averagePercentage;
    }

    public void setAveragePercentage(double averagePercentage) {
        this.averagePercentage = averagePercentage;
    }

    public int getExamsTaken() {
        return examsTaken;
    }

    public void setExamsTaken(int examsTaken) {
        this.examsTaken = examsTaken;
    }

    public double getFinalScore() {
        return finalScore;
    }

    public void setFinalScore(double finalScore) {
        this.finalScore = finalScore;
    }
}
