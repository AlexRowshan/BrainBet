package edu.usc.csci310.project.Game;

import java.util.HashSet;
import java.util.Set;

public class GameSession {
    private final String gameCode;
    private final String host;
    private final Set<String> participants = new HashSet<>();

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
}
