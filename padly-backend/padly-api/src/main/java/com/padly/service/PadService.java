package com.padly.service;

import com.padly.dto.PadRequestDTO;
import com.padly.dto.PadResponseDTO;
import com.padly.entity.Pad;
import com.padly.repository.PadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
public class PadService {

    @Autowired
    private PadRepository padRepository;

    public PadResponseDTO getPad(String slug) {
        Pad pad = padRepository.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pad not found."));
        return new PadResponseDTO(pad);
    }

    public void createOrUpdatePad(String slug, PadRequestDTO dto) {
        Pad pad = padRepository.findBySlug(slug).orElse(null);

        if (pad == null) {
            pad = new Pad();
            pad.setSlug(slug);
            pad.setCreatedAt(LocalDateTime.now());
        }

        pad.setContent(dto.getContent());
        pad.setUpdatedAt(LocalDateTime.now());

        padRepository.save(pad);
    }
}
