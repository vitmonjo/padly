package com.padly.dto;

import jakarta.validation.constraints.NotBlank;

public class PadRequestDTO {

    @NotBlank(message = "O conteúdo não pode estar em branco.")
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
