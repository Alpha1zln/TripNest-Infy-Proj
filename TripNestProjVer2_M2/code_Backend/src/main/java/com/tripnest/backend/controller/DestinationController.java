package com.tripnest.backend.controller;

import com.tripnest.backend.dto.destination.DestinationRequestDTO;
import com.tripnest.backend.dto.destination.DestinationResponseDTO;
import com.tripnest.backend.service.DestinationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    private final DestinationService destinationService;

    public DestinationController(DestinationService destinationService) {
        this.destinationService = destinationService;
    }

    // Create a new destination.
    @PostMapping
    public ResponseEntity<DestinationResponseDTO> createDestination(
            @RequestBody DestinationRequestDTO request) {

        return ResponseEntity.ok(
                destinationService.createDestination(request)
        );
    }

    // Get all destinations.
    @GetMapping
    public ResponseEntity<List<DestinationResponseDTO>> getAllDestinations() {

        return ResponseEntity.ok(
                destinationService.getAllDestinations()
        );
    }

    // Get one destination by ID.
    @GetMapping("/{id}")
    public ResponseEntity<DestinationResponseDTO> getDestinationById(
            @PathVariable Long id) {

        return destinationService.getDestinationById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update an existing destination.
    @PutMapping("/{id}")
    public ResponseEntity<DestinationResponseDTO> updateDestination(
            @PathVariable Long id,
            @RequestBody DestinationRequestDTO request) {

        return ResponseEntity.ok(
                destinationService.updateDestination(id, request)
        );
    }

    // Delete a destination.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDestination(
            @PathVariable Long id) {

        destinationService.deleteDestination(id);

        return ResponseEntity.noContent().build();
    }
}