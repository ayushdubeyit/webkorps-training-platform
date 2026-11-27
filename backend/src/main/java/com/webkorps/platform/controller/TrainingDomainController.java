package com.webkorps.platform.controller;

import com.webkorps.platform.common.exception.ApiError;
import com.webkorps.platform.dto.TrainingDomainCreateRequest;
import com.webkorps.platform.dto.TrainingDomainResponse;
import com.webkorps.platform.dto.TrainingDomainUpdateRequest;
import com.webkorps.platform.training.domain.service.TrainingDomainService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class TrainingDomainController {

    private final TrainingDomainService domainService;

    public TrainingDomainController(TrainingDomainService domainService) {
        this.domainService = domainService;
    }

    @GetMapping("/api/v1/domains")
    public List<TrainingDomainResponse> getActiveDomains() {
        return domainService.getActiveDomains();
    }

    @PostMapping("/api/v1/manager/domains")
    @ResponseStatus(HttpStatus.CREATED)
    public TrainingDomainResponse createDomain(@Valid @RequestBody TrainingDomainCreateRequest request) {
        return domainService.createDomain(request);
    }

    @PatchMapping("/api/v1/manager/domains/{id}")
    public TrainingDomainResponse updateDomain(
            @PathVariable Long id,
            @Valid @RequestBody TrainingDomainUpdateRequest request) {
        return domainService.updateDomain(id, request);
    }

    @PatchMapping("/api/v1/manager/domains/{id}/deactivate")
    public TrainingDomainResponse deactivateDomain(@PathVariable Long id) {
        return domainService.deactivateDomain(id);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationFailure(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getDefaultMessage())
                .findFirst()
                .orElse("Request validation failed");
        ApiError error = new ApiError(HttpStatus.BAD_REQUEST.value(), "Bad Request", message);
        return ResponseEntity.badRequest().body(error);
    }
}
