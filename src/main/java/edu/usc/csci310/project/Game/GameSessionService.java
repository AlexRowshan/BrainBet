package edu.usc.csci310.project.Game;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GameSessionService {
    private final Map<String, GameSession> sessions = new ConcurrentHashMap<>();

    public String createGameSession(String host) {
        String gameCode = generateGameCode();
        sessions.put(gameCode, new GameSession(gameCode, host));
        return gameCode;
    }

    public boolean joinGameSession(String gameCode, String participant) {
        GameSession session = sessions.get(gameCode);
        if (session != null) {
            session.addParticipant(participant);
            return true;
        }
        return false;
    }

    public GameSession getGameSession(String gameCode) {
        return sessions.get(gameCode);
    }

    private String generateGameCode() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < 4; i++) {
            int index = (int) (Math.random() * characters.length());
            result.append(characters.charAt(index));
        }
        return result.toString();
    }
}