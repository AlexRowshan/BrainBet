package edu.usc.csci310.project.Game;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;
import org.springframework.beans.factory.annotation.Autowired;

@Controller
public class GameController {
    @Autowired
    private GameSessionService gameSessionService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatGptService chatGptService;

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

    @MessageMapping("/startGame")
    public void startGame(@Payload StartGameRequest startGameRequest) {
        String gameCode = startGameRequest.getGameCode();
        String prompt = startGameRequest.getPrompt();
        String response = chatGptService.getTriviaQuestions(prompt);
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
        messagingTemplate.convertAndSend("/topic/gameStart/" + gameCode, questions);

    }

    public static class StartGameRequest {
        private String gameCode;
        private String prompt;

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
    }


}


