package edu.usc.csci310.project.Game;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class GameManager {
    private final Map<String, GameSession> gameSessions = new HashMap<>();

    public GameSession getGameSession(String gameCode) {
        return gameSessions.get(gameCode);
    }

    public void createGameSession(String gameCode, String host) {
        GameSession gameSession = new GameSession(gameCode, host);
        gameSessions.put(gameCode, gameSession);
    }
}
