package com.webkorps.platform.training.module.service;

import org.springframework.core.io.Resource;

public record DownloadedTrainingFile(Resource resource, String originalFilename, long sizeBytes) {
}
