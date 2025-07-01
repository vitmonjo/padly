package com.padly.dto;

import jakarta.validation.constraints.NotBlank;

public class PadRequestDTO {

    private String content;

    public PadRequestDTO() {}

    public PadRequestDTO(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
