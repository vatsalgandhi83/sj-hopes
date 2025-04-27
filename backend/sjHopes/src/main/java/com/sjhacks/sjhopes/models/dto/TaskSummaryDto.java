package com.sjhacks.sjhopes.models.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskSummaryDto {

    private long totalTasks;
    private long openTasks;
    private long assignedTasks;
    private long completedTasks;

}
