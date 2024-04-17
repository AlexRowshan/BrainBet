package edu.usc.csci310.project.Game;

public class CreateGameRequest {
    private String username;
    private float wager;
    // Default constructor is required for JSON deserialization
    public CreateGameRequest() {

    }

    // Constructor with all fields
    public CreateGameRequest(String username) {
        this.username = username;
    }

    // Getter
    public String getUsername() {
        return username;
    }

    // Setter
    public void setUsername(String username) {
        this.username = username;
    }

    public float getWager() {
        return wager;
    }

    public void setWager(float wager) {
        this.wager = wager;
    }
}