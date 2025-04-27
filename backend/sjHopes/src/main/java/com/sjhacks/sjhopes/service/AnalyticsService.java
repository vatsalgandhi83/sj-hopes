package com.sjhacks.sjhopes.service;

import com.sjhacks.sjhopes.models.dto.ShelterSummaryDto;
import com.sjhacks.sjhopes.models.dto.ShelterTypeSummaryDto;
import com.sjhacks.sjhopes.models.dto.TaskSummaryDto;

import java.util.List;

public interface AnalyticsService {

    ShelterSummaryDto getShelterSummary();

    TaskSummaryDto getTaskSummary();

    List<ShelterTypeSummaryDto> getShelterTypeSummaries();
}
