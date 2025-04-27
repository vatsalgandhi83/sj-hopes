package com.sjhacks.sjhopes.controller;

import com.sjhacks.sjhopes.mapper.ClientMapper;
import com.sjhacks.sjhopes.models.dto.ClientRequestDto;
import com.sjhacks.sjhopes.models.dto.ClientResponseDto;
import com.sjhacks.sjhopes.models.entity.Client;
import com.sjhacks.sjhopes.service.ClientService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "*")
@Slf4j
public class ClientController {

    @Autowired
    private ClientService clientService;

    // POST /api/clients - Register a new client
    @PostMapping
    public ResponseEntity<ClientResponseDto> registerClient(@Valid @RequestBody ClientRequestDto clientRequest) {
        try {
            Client registeredClient = clientService.registerClient(clientRequest);
            ClientResponseDto responseDto = ClientMapper.mapToResponseDTO(registeredClient);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
        } catch (Exception e) {
            log.error("CONTROLLER: Error registering client", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error registering client", e);
        }
    }

    // GET /api/clients - Get all clients
    @GetMapping
    public List<ClientResponseDto> getAllClients() {
        log.info("CONTROLLER: GET /api/clients invoked");
        return clientService.getAllClients().stream()
                .map(ClientMapper::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // GET /api/clients/{id} - Get a specific client
    @GetMapping("/{id}")
    public ResponseEntity<ClientResponseDto> getClientById(@PathVariable Long id) {
        return clientService.getClientById(id)
                .map(ClientMapper::mapToResponseDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}
