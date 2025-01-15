package edu.usc.csci310.project.openai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class OpenAIConfig {
    //TODO: fix application properties
    private final String openApiKey = " ";

    @Bean
    public RestTemplate template(){
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getInterceptors().add((request, body, execution) ->{
            request.getHeaders().add("Authorization", "Bearer "+openApiKey);
            return execution.execute(request, body);
        });
        return restTemplate;
    }
}
