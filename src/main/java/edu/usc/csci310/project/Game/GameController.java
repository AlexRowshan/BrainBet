package edu.usc.csci310.project.Game;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import java.util.Random;
import org.springframework.beans.factory.annotation.Autowired;

@Controller
public class GameController {
    @Autowired
    private GameSessionService gameSessionService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/create")
    @SendTo("/topic/gameCreated")
    public String createGame(@Payload CreateGameRequest createGameRequest) {
        System.out.println("Creating game...");
        String username = createGameRequest.getUsername();
        String gameCode = gameSessionService.createGameSession(username + " (Host)");
        System.out.println("Generated game code: " + gameCode);
        return gameCode;
    }

    @MessageMapping("/join")
    public void joinGame(@Payload JoinRequest joinRequest, SimpMessageHeaderAccessor headerAccessor) {
        boolean success = gameSessionService.joinGameSession(joinRequest.getGameCode(), joinRequest.getUsername());
        if (success) {
            // Send an update to all participants of the game
            GameSession session = gameSessionService.getGameSession(joinRequest.getGameCode());
            messagingTemplate.convertAndSend("/topic/gameUpdate/" + joinRequest.getGameCode(), session);
        }
    }
}


