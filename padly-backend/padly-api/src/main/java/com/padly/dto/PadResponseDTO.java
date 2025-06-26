package com.padly.dto;

import com.padly.entity.Pad;

import java.time.LocalDateTime;

public class PadResponseDTO {

    private String slug;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PadResponseDTO() {}

    public PadResponseDTO(Pad pad) {
        this.slug = pad.getSlug();
        this.content = pad.getContent();
        this.createdAt = pad.getCreatedAt();
        this.updatedAt = pad.getUpdatedAt();
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
