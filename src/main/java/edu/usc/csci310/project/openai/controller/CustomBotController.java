package edu.usc.csci310.project.openai.controller;

import com.google.api.client.util.Value;
import edu.usc.csci310.project.openai.dto.ChatGPTRequest;
import edu.usc.csci310.project.openai.dto.ChatGPTResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/bot")
public class CustomBotController {

@Value("${openai.model}")
    private String model;
@Value("$[openai.api.url}")
private String apiUrl;

@Autowired
private RestTemplate template;
@GetMapping("/chat")
    public String chat(@RequestParam("prompt") String prompt){
        System.out.println("MODEL VALUE "+model+apiUrl);
        ChatGPTRequest request = new ChatGPTRequest("gpt-3.5-turbo", prompt);
        ChatGPTResponse chatGPTResponse= template.postForObject("https://api.openai.com/v1/chat/completions", request, ChatGPTResponse.class);

        return chatGPTResponse.getChoices().get(0).getMessage().getContent();
}
}
