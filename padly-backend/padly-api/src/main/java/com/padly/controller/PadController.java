package com.padly.controller;

import com.padly.dto.PadRequestDTO;
import com.padly.dto.PadResponseDTO;
import com.padly.service.PadService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pads")
@CrossOrigin(origins = "*") // Ou configure especificamente seu frontend depois
public class PadController {

    @Autowired
    private PadService padService;

    @GetMapping("/{slug}")
    public ResponseEntity<PadResponseDTO> getPad(@PathVariable String slug) {
        PadResponseDTO response = padService.getPad(slug);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{slug}")
    public ResponseEntity<String> createOrUpdatePad(@PathVariable String slug,
                                                    @RequestBody @Valid PadRequestDTO dto) {
        padService.createOrUpdatePad(slug, dto);
        return ResponseEntity.ok("Pad saved successfully.");
    }
}
