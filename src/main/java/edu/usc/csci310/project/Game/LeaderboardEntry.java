package edu.usc.csci310.project.Game;

public class LeaderboardEntry {
    private final String userName;
    private int score;

    public LeaderboardEntry(String userName, int score) {
        this.userName = userName;
        this.score = score;
    }

    public String getUserName() {
        return userName;
    }

    public int getScore() {
        return score;
    }

    // Setter method for updating the score
    public void setScore(int score) {
        this.score = score;
    }
}
