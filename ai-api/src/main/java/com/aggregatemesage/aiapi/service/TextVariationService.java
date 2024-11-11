package com.aggregatemesage.aiapi.service;

import com.aggregatemesage.aiapi.dto.TextAiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TextVariationService {
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${huggingface.api.url}")
    private String apiUrl;

    @Value("${huggingface.api.key}")
    private String apiKey;

    public TextAiResponse generateVariants(String text) {
        // Send request to Hugging Face Inference API
        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                getMapHttpEntity(text),
                new ParameterizedTypeReference<>() {}
        );

        System.out.println(response.getBody().toString());

        // Extract generated text
        Map<String, Object> result = response.getBody().get(0);
        if (result != null && result.containsKey("generated_text")) {
            String generatedText = result.get("generated_text").toString();
            return parseResponse(generatedText);
        } else {
            return parseResponse("error");
        }
    }

    @NotNull
    private HttpEntity<Map<String, Object>> getMapHttpEntity(String text) {
        // Set headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);

        // Prepare JSON payload
        String prompt = String.format("""
            Generate 4 different versions of this text:
            "%s"
            
            1. Professional version
            2. Casual version
            3. Friendly version
            4. Formal version
            
            Format:
            Professional: [version]
            Casual: [version]
            Friendly: [version]
            Formal: [version]
            """, text);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("inputs", prompt);
        requestBody.put("parameters", Map.of(
                "max_length", 500,
                "temperature", 0.7
        ));

        // Create HTTP entity
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        return entity;
    }

    private TextAiResponse parseResponse(String response) {
        String[] lines = response.split("\n");
        TextAiResponse.TextAiResponseBuilder builder = TextAiResponse.builder();

        for (String line : lines) {
            if (line.startsWith("Professional:")) {
                builder.professional(line.substring(13).trim());
            } else if (line.startsWith("Casual:")) {
                builder.casual(line.substring(7).trim());
            } else if (line.startsWith("Friendly:")) {
                builder.friendly(line.substring(9).trim());
            } else if (line.startsWith("Formal:")) {
                builder.formal(line.substring(7).trim());
            }
        }
        return builder.build();
    }
}
