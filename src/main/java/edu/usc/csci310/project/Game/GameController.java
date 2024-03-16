package edu.usc.csci310.project.Game;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Random;

@Controller
public class GameController {

    @MessageMapping("/create")
    @SendTo("/topic/gameCreated")
    public String createGame() {
        System.out.println("Creating game...");

        // Generate a unique game code
        String gameCode = generateGameCode();
        System.out.println("Generated game code: " + gameCode);
        return gameCode;
    }

    private String generateGameCode() {
        String characters = "abcdefghijklmnopqrstuvwxyz";
        StringBuilder result = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < 4; i++) {
            int index = random.nextInt(characters.length());
            result.append(characters.charAt(index));
        }
        return result.toString();
    }
}
