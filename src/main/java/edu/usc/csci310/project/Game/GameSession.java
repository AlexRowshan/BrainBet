package edu.usc.csci310.project.Game;

import java.util.HashSet;
import java.util.Set;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;


public class GameSession {
    private final String gameCode;
    private final String host;
    private final Set<String> participants = new HashSet<>();
    private final List<LeaderboardEntry> leaderboard = new ArrayList<>(); // Changed to List


    public GameSession(String gameCode, String host) {
        this.gameCode = gameCode;
        this.host = host;
        this.participants.add(host); // Host also a participant
    }

    public void addParticipant(String participant) {
        participants.add(participant);
    }

    // Getters
    public String getGameCode() {
        return gameCode;
    }

    public String getHost() {
        return host;
    }

    public Set<String> getParticipants() {
        return participants;
    }

    // Update participant score or add a new participant with score
    public void updateParticipantScore(String userName, int userScore) {
        // Find the existing entry for the user or create a new one
        LeaderboardEntry entry = leaderboard.stream()
                .filter(e -> e.getUserName().equals(userName))
                .findFirst()
                .orElseGet(() -> {
                    LeaderboardEntry newEntry = new LeaderboardEntry(userName, 0); // Assuming initial score is 0
                    leaderboard.add(newEntry);
                    return newEntry;
                });

        // Update the user's score
        entry.setScore(userScore);
    }

    // Get leaderboard data
    public List<LeaderboardEntry> getLeaderboardData() {
        // Sort the leaderboard entries by score in descending order
        leaderboard.sort(Comparator.comparingInt(LeaderboardEntry::getScore).reversed());
        return leaderboard;
    }
}
