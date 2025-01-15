package edu.usc.csci310.project.openai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class OpenAIConfig {
    //TODO: fix application properties
    private final String openApiKey = "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";

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
