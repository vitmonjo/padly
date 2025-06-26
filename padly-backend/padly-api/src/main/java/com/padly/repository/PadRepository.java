package com.padly.repository;

import com.padly.entity.Pad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PadRepository extends JpaRepository<Pad, Long> {

    // Custom finder method: find pad by slug (e.g., /notes/my-note)
    Optional<Pad> findBySlug(String slug);

    // Optional: check if a slug already exists
    boolean existsBySlug(String slug);
}
