package com.sjhacks.sjhopes.service;

import com.sjhacks.sjhopes.models.dto.ClientRequestDto;
import com.sjhacks.sjhopes.models.entity.Client;
import com.sjhacks.sjhopes.models.enums.ClientStatus;

import java.util.List;
import java.util.Optional;

public interface ClientService {

    Client registerClient(ClientRequestDto clientRequest);

    Optional<Client> getClientById(Long id);

    List<Client> getAllClients();

    Client updateClientStatus(Long clientId, ClientStatus newStatus);

    Client assignShelterToClient(Long clientId, Long shelterId);

    Client updateClientNotes(Long clientId, String notes);
}
