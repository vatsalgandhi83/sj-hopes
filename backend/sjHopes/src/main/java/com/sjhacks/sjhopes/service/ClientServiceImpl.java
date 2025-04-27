package com.sjhacks.sjhopes.service;

import com.sjhacks.sjhopes.mapper.ClientMapper;
import com.sjhacks.sjhopes.models.dto.ClientRequestDto;
import com.sjhacks.sjhopes.models.entity.Client;
import com.sjhacks.sjhopes.models.entity.Shelter;
import com.sjhacks.sjhopes.models.enums.ClientStatus;
import com.sjhacks.sjhopes.repository.ClientRepository;
import com.sjhacks.sjhopes.repository.ShelterRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClientServiceImpl implements ClientService {

    @Autowired
    private ClientRepository clientRepository;
    @Autowired
    private ShelterRepository shelterRepository;

    @Transactional
    public Client registerClient(ClientRequestDto clientRequest) {
        Client newClient = ClientMapper.mapToEntity(clientRequest, null);
        return clientRepository.save(newClient);
    }

    @Override
    public Optional<Client> getClientById(Long id) {
        return clientRepository.findById(id);
    }

    @Override
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @Override
    @Transactional
    public Client updateClientStatus(Long clientId, ClientStatus newStatus) {
        log.info("Service: Updating status for client id: {} to {}", clientId, newStatus);
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new EntityNotFoundException("Client not found with id: " + clientId));
        client.setStatus(newStatus);
        // If moving out of shelter, maybe clear shelter link?
        if (newStatus != ClientStatus.SHELTERED && client.getCurrentShelter() != null) {
            log.info("Service: Client {} status changed from SHELTERED, clearing shelter link.", clientId);
            client.setCurrentShelter(null);
        }
        return clientRepository.save(client);
    }

    @Override
    @Transactional
    public Client assignShelterToClient(Long clientId, Long shelterId) {
        log.info("Service: Assigning shelter id: {} to client id: {}", shelterId, clientId);
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new EntityNotFoundException("Client not found with id: " + clientId));
        Shelter shelter = shelterRepository.findById(shelterId)
                .orElseThrow(() -> new EntityNotFoundException("Shelter not found with id: " + shelterId));

        client.setCurrentShelter(shelter);
        client.setStatus(ClientStatus.SHELTERED); // Update status
        return clientRepository.save(client);
    }

    @Override
    @Transactional
    public Client updateClientNotes(Long clientId, String notes) {
        log.info("Service: Updating notes for client id: {}", clientId);
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new EntityNotFoundException("Client not found with id: " + clientId));
        client.setCaseworkerNotes(notes);
        return clientRepository.save(client);
    }
}
