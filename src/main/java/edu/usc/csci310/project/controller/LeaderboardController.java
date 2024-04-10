package edu.usc.csci310.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LeaderboardController {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;


    @MessageMapping("/gameResult")
    public void handleGameResult(@Payload GameResult gameResult) {
        System.out.println("Here");
        String gameCode = gameResult.getGameCode();
        String username = gameResult.getUsername();
        int score = gameResult.getScore();

        System.out.println(username + " has " + score);

        // Create a score data object
        ScoreData scoreData = new ScoreData(username, score);

        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // Send the score data to the frontend via WebSocket
        System.out.println("Sending to " + "/topic/leaderboard/" + gameCode);
        simpMessagingTemplate.convertAndSend("/topic/leaderboard/" + gameCode, scoreData);
    }


    // GameResult class
    public static class GameResult {
        private String gameCode;
        private String username;
        private int score;

        public String getGameCode() {
            return gameCode;
        }

        public void setGameCode(String gameCode) {
            this.gameCode = gameCode;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public int getScore() {
            return score;
        }

        public void setScore(int score) {
            this.score = score;
        }
    }

    // ScoreData class
    public static class ScoreData {
        private String username;
        private int score;

        public ScoreData(String username, int score) {
            this.username = username;
            this.score = score;
        }

        public String getUsername() {
            return username;
        }

        public int getScore() {
            return score;
        }
    }
}