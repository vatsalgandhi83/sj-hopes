package com.sjhacks.sjhopes.models.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ClientRequestDto {

    @NotBlank(message = "Name cannot be blank")
    @Size(min = 1, max = 100, message = "Name length invalid")
    private String name;

    private String caseworkerNotes; // Optional notes

}
