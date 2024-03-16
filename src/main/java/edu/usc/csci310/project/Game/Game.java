package edu.usc.csci310.project.Game;
import java.util.ArrayList;
import java.util.List;

public class Game {
    private final String gameCode;
    private final List<String> players;

    public Game(String gameCode) {
        this.gameCode = gameCode;
        this.players = new ArrayList<>();
    }

    public void addPlayer(String username) {
        players.add(username);
    }

    public List<String> getPlayers() {
        return players;
    }
}