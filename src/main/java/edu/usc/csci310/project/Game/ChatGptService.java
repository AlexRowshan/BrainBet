package edu.usc.csci310.project.Game;

import edu.usc.csci310.project.openai.dto.ChatGPTRequest;
import edu.usc.csci310.project.openai.dto.ChatGPTResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ChatGptService {

    @Value("${openai.model}")
    private String model;

    @Value("${openai.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;

    public ChatGptService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getTriviaQuestions(String prompt) {
        String structuredPrompt = "Give me 10 trivia questions related to " + prompt + " with 4 options each and indicate the correct answer. Format the response as follows: Question: <Question> Options: A) <Option A>, B) <Option B>, C) <Option C>, D) <Option D> Correct Answer: <Correct Option>";

        ChatGPTRequest request = new ChatGPTRequest(model, structuredPrompt);
        ChatGPTResponse response = restTemplate.postForObject(apiUrl, request, ChatGPTResponse.class);
        if (response != null) {
            return response.getChoices().get(0).getMessage().getContent();
        }
        else{
            return "Error: Response is null";
        }
    }
}