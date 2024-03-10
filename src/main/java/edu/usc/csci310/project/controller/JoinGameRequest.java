package edu.usc.csci310.project.controller;

public class JoinGameRequest {
    private String gameCode;
    private String playerName;

    // Constructors, getters, and setters
    public JoinGameRequest() {}

    public String getGameCode() {
        return gameCode;
    }

    public void setGameCode(String gameCode) {
        this.gameCode = gameCode;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }
}
