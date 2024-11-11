package com.aggregatemesage.aiapi.controller;

import com.aggregatemesage.aiapi.dto.TextAiRequest;
import com.aggregatemesage.aiapi.dto.TextAiResponse;
import com.aggregatemesage.aiapi.service.TextVariationService;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/text")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TextVariationController {

    private final TextVariationService textVariantService;

    @PostMapping("/generate-variations")
    public TextAiResponse generateVariations(@RequestBody TextAiRequest request) {
        return textVariantService.generateVariants(request.getText());

    }

}
