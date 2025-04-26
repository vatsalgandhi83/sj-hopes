package com.sjhacks.sjhopes.models.entity;


import com.sjhacks.sjhopes.models.enums.TaskStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity(name = "tasks")
@Data
@NoArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = true) // Allow longer descriptions
    private String description; // Details about the task

    @Column(nullable = true)
    private String location; // Simple text for location, e.g., "St James Park"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status = TaskStatus.OPEN; // Default to OPEN when created

    @Column(nullable = true) // Null when the task is OPEN
    private String clientId; // ID of the client assigned to the task

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime lastUpdated;

    @Column(nullable = true) // Null when the task is OPEN
    private LocalDateTime taskDateTime; // If task is scheduled

    @Column(nullable = true)
    private String estimatedDuration; // e.g., "2 hours"

    @Column(nullable = true)
    private String compensationDetails;  // e.g., "$15/hour", "Stipend provided"

    // --- Added Contact Info ---
    @Column(nullable = true)
    private String taskContactName; // Name of supervisor/contact for this task

    @Column(nullable = true)
    private String taskContactPhone; // Phone number for the task contact

}
