package edu.usc.csci310.project.controller;

// In the GameController
import edu.usc.csci310.project.controller.LeaderboardEntry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.game.model.GameSession;
import com.example.game.repository.GameSessionRepository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/leaderboard")
public class GameController {

    @GetMapping
    public ResponseEntity<List<LeaderboardEntry>> getLeaderboard() {
        // Retrieve all completed game sessions from the database
        //List<GameSession> gameSessions = gameSessionRepository.findByCompleted(true);

        // Prepare the leaderboard data

        /*List<LeaderboardEntry> leaderboardEntries = gameSessions.stream()
                .flatMap(session -> session.getParticipantScores().entrySet().stream()
                        .map(entry -> new LeaderboardEntry(entry.getKey(), entry.getValue())))
                .sorted((a, b) -> b.getScore() - a.getScore()) // Sort by score in descending order
                .collect(Collectors.toList());*/

        return ResponseEntity.status(HttpStatus.OK).body(leaderboardEntries);
    }
}

