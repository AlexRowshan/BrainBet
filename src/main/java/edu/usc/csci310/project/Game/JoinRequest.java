package edu.usc.csci310.project.Game;

public class JoinRequest {
    private String gameCode;
    private String username;

    // Getters
    public String getGameCode() {
        return gameCode;
    }

    public String getUsername() {
        return username;
    }

    // Setters
    public void setGameCode(String gameCode) {
        this.gameCode = gameCode;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
