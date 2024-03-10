package edu.usc.csci310.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.ExecutionException;

@RestController
public class GameController {
    private final GameManager gameManager;

    @Autowired
    GameController(GameManager gameManager){
        this.gameManager = gameManager;
    }

    @PostMapping("/create")
    public ResponseEntity<String> createGame(@RequestBody CreateGameRequest request) {
        String gameCode = gameManager.createGameSession(request.getUsername());
        return ResponseEntity.ok().body(gameCode);
    }


    @PostMapping("/join")
    public ResponseEntity<String> joinGame (@RequestBody JoinGameRequest request) throws ExecutionException, InterruptedException {

        boolean success = gameManager.joinGameSession(request.getGameCode(), request.getPlayerName());
        if (success) {
            return ResponseEntity.ok().body("Joined the game successfully");
        } else {
            return ResponseEntity.badRequest().body("Failed to join the game. It might not exist.");
        }
    }



}
