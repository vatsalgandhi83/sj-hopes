package com.sjhacks.sjhopes.service;

import com.sjhacks.sjhopes.models.dto.ShelterSummaryDto;
import com.sjhacks.sjhopes.models.dto.ShelterTypeSummaryDto;
import com.sjhacks.sjhopes.models.dto.TaskSummaryDto;
import com.sjhacks.sjhopes.models.enums.TaskStatus;
import com.sjhacks.sjhopes.repository.ShelterRepository;
import com.sjhacks.sjhopes.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsServiceImpl implements AnalyticsService {

    @Autowired
    private ShelterRepository shelterRepository;
    @Autowired
    private TaskRepository taskRepository;

    public ShelterSummaryDto getShelterSummary() {
        log.info("Service: Calculating shelter summary analytics");

        long totalShelters = shelterRepository.count();
        long activeShelters = shelterRepository.countByIsActive(true);
        long inactiveShelters = totalShelters - activeShelters;

        // Handle potential null if no active shelters exist
        long totalCapacity = shelterRepository.getTotalActiveCapacity() != null ? shelterRepository.getTotalActiveCapacity() : 0L;
        long currentAvailability = shelterRepository.getCurrentActiveAvailability() != null ? shelterRepository.getCurrentActiveAvailability() : 0L;

        double occupancyRate = 0.0;
        if (totalCapacity > 0) {
            occupancyRate = ((double) (totalCapacity - currentAvailability) / totalCapacity) * 100.0;
            // Optional: Round the rate
            occupancyRate = Math.round(occupancyRate * 10.0) / 10.0; // e.g., 85.5
        }

        long petsAllowed = shelterRepository.countByAllowsPetsAndIsActive(true, true);
        long partnersAllowed = shelterRepository.countByAllowsPartnerAndIsActive(true, true);

        return new ShelterSummaryDto(
                totalShelters,
                activeShelters,
                inactiveShelters,
                totalCapacity,
                currentAvailability,
                occupancyRate,
                petsAllowed,
                partnersAllowed
        );
    }

    public TaskSummaryDto getTaskSummary() {
        log.info("Service: Calculating task summary analytics");

        long totalTasks = taskRepository.count();
        long openTasks = taskRepository.countByStatus(TaskStatus.OPEN);
        long assignedTasks = taskRepository.countByStatus(TaskStatus.ASSIGNED);
        long completedTasks = taskRepository.countByStatus(TaskStatus.COMPLETED);

        return new TaskSummaryDto(
                totalTasks,
                openTasks,
                assignedTasks,
                completedTasks
        );
    }

    public List<ShelterTypeSummaryDto> getShelterTypeSummaries() {
        log.info("Service: Calculating shelter type summary analytics");
        List<ShelterTypeSummaryDto> summaries = shelterRepository.getActiveShelterTypeSummaries();

        // Calculate occupancy rate for each type
        summaries.forEach(summary -> {
            double occupancyRate = 0.0;
            if (summary.getTotalCapacity() > 0) {
                occupancyRate = ((double) (summary.getTotalCapacity() - summary.getCurrentAvailability()) / summary.getTotalCapacity()) * 100.0;
                occupancyRate = Math.round(occupancyRate * 10.0) / 10.0; // Round
            }
            summary.setOccupancyRate(occupancyRate);
        });

        return summaries;
    }
}
