package edu.usc.csci310.project.Game;

import org.apache.catalina.connector.Request;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Collections;
import java.util.Comparator;


@RestController
public class LeaderboardController {
    private final GameManager gameManager;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public LeaderboardController(GameManager gameManager, SimpMessagingTemplate messagingTemplate) {
        this.gameManager = gameManager;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/api/game/{gameCode}/score")
    public void submitScore(@PathVariable String gameCode, @Payload Score score) {
        System.out.println("inside");
        System.out.println("Username is " + score.getUsername());
        System.out.println("Score is " + score.getScore());

        // Send the Score object to the WebSocket destination
        messagingTemplate.convertAndSend("/topic/gameStart/" + gameCode, score);
    }
}


