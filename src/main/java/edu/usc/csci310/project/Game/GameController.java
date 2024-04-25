package edu.usc.csci310.project.Game;
import edu.usc.csci310.project.user.UserService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.*;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.ErrorResponse;

@Controller
public class GameController {
    @Autowired
    private GameSessionService gameSessionService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatGptService chatGptService;

    @Autowired
    private UserService userService;

    @MessageMapping("/create")
    @SendTo("/topic/gameCreated")
    public String createGame(@Payload CreateGameRequest createGameRequest) {
        System.out.println("Creating game...");
        String username = createGameRequest.getUsername();
        float wager = createGameRequest.getWager();
        String gameCode = gameSessionService.createGameSession(username + " (Host)", wager);
        System.out.println("Generated game code: " + gameCode);
        return gameCode;
    }

    @MessageMapping("/join")
    public void joinGame(@Payload JoinRequest joinRequest, SimpMessageHeaderAccessor headerAccessor) throws ExecutionException, InterruptedException {
        GameSession session = gameSessionService.getGameSession(joinRequest.getGameCode());
        System.out.println("this is the session");
        System.out.println(session);
        float userBalance = userService.getWagerAmount(joinRequest.getUsername());
        System.out.println(userBalance);
        System.out.println(session.getWager());
        if (userBalance >= session.getWager()) {
            System.out.println("hi we are here");
            boolean success = gameSessionService.joinGameSession(joinRequest.getGameCode(), joinRequest.getUsername());
            if (success) {
                // Successfully joined the game
                messagingTemplate.convertAndSend("/topic/gameUpdate/" + joinRequest.getGameCode(), session);
            }
            else{
                String jsonErrorMessage = "{\"error\": \"Invalid Game Code!\"}";
                messagingTemplate.convertAndSend("/topic/gameUpdate/" + joinRequest.getGameCode(), jsonErrorMessage);
            }
        } else {
            System.out.println("You are not enough money to join the game.");
            //String errorMessage = "Insufficient balance to join the game.";
            String jsonErrorMessage = "{\"error\": \"Not enough coin!\"}";
            messagingTemplate.convertAndSend("/topic/gameUpdate/" + joinRequest.getGameCode(), jsonErrorMessage);
        }
    }

    @MessageMapping("/startGame")
    public void startGame(@Payload StartGameRequest startGameRequest) {
        String gameCode = startGameRequest.getGameCode();
        String prompt = startGameRequest.getPrompt();
        String response = chatGptService.getTriviaQuestions(prompt);
        float wager = startGameRequest.getWager();
        List<TriviaQuestion> questions = new ArrayList<>();
        String[] questionBlocks = response.split("Question: "); // Split by the start of each question
        for (String block : questionBlocks) {
            if (block.trim().isEmpty()) continue; // Skip the first empty split
            String[] parts = block.split("Options: ");
            String questionText = parts[0].trim();
            String optionsAndAnswer = parts[1].trim();
            String[] optionsParts = optionsAndAnswer.split("Correct Answer: ");
            String[] options = optionsParts[0].trim().split(", ");
            String correctAnswer = optionsParts[1].trim();

            TriviaQuestion question = new TriviaQuestion();
            question.setQuestion(questionText);
            question.setOptions(Arrays.asList(options));
            question.setCorrectAnswer(correctAnswer);
            questions.add(question);
        }
        Map<String, Object> startMessage = new HashMap<>();
        startMessage.put("questions", questions);
        startMessage.put("wager", wager);
        messagingTemplate.convertAndSend("/topic/gameStart/" + gameCode, startMessage);
    }

    public static class StartGameRequest {
        private String gameCode;
        private String prompt;
        private float wager;
        public StartGameRequest() {
            // Default constructor
        }

        public StartGameRequest(String gameCode) {
            this.gameCode = gameCode;
        }

        public String getGameCode() {
            return gameCode;
        }

        public void setGameCode(String gameCode) {
            this.gameCode = gameCode;
        }

        public String getPrompt() {
            return prompt;
        }

        public void setPrompt(String prompt) {
            this.prompt = prompt;
        }

        public float getWager() {
            return wager;
        }

        public void setWager(float wager) {
            this.wager = wager;
        }
    }



}



