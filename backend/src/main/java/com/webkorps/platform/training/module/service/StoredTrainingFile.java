package com.webkorps.platform.training.module.service;

record StoredTrainingFile(String storageKey, String originalFilename, long sizeBytes, String sha256) {
}
