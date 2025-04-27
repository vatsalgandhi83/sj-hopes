package com.sjhacks.sjhopes.models.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TaskRequestDto {

    @NotBlank(message = "Task title cannot be blank")
    @Size(max = 255)
    private String title;

    private String description;

    @Size(max = 255)
    private String location;

    @FutureOrPresent(message = "Task date/time must be now or in the future if provided")
    private LocalDateTime taskDateTime;

    private String estimatedDuration;

    private String compensationDetails;

    private String taskContactName;

    @Pattern(regexp = "^(\\+\\d{1,3}[- ]?)?\\(?\\d{3}\\)?[- ]?\\d{3}[- ]?\\d{4}$", message = "Invalid phone number format")
    private String taskContactPhone;

}
