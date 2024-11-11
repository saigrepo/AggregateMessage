package com.aggregatemesage.aiapi.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TextAiResponse {
    private String professional;
    private String casual;
    private String friendly;
    private String formal;
}