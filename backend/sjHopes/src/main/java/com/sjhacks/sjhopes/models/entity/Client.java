package com.sjhacks.sjhopes.models.entity;

import com.sjhacks.sjhopes.models.enums.ClientStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity(name = "clients")
@Data
@NoArgsConstructor
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Internal system ID

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClientStatus status = ClientStatus.SEEKING_PLACEMENT; // Default status

    // Link to the current shelter (nullable if not placed)
    @ManyToOne(fetch = FetchType.LAZY) // Use Lazy fetching
    @JoinColumn(name = "current_shelter_id", referencedColumnName = "id", nullable = true)
    private Shelter currentShelter;

    @CreationTimestamp // Automatically set on creation
    @Column(nullable = false, updatable = false)
    private LocalDateTime registrationDate;

    @UpdateTimestamp // Automatically set on update
    @Column(nullable = false)
    private LocalDateTime lastActivityDate;

    @Column(columnDefinition = "TEXT", nullable = true)
    private String caseworkerNotes; // Optional notes field
}
