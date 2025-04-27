package com.sjhacks.sjhopes.models.enums;

public enum ClientStatus {
    SEEKING_PLACEMENT, // Newly registered, looking for shelter
    SHELTERED,         // Currently placed in a shelter via the system
    INACTIVE,          // No longer active in the system (e.g., left shelter)
    PERMANENTLY_HOUSED // Achieved stable housing (future goal state)
}
