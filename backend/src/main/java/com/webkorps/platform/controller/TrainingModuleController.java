package com.webkorps.platform.controller;

import com.webkorps.platform.common.exception.ApiError;
import com.webkorps.platform.dto.TrainingModuleCreateRequest;
import com.webkorps.platform.dto.TrainingModuleFileResponse;
import com.webkorps.platform.dto.TrainingModuleResponse;
import com.webkorps.platform.dto.TrainingModuleUpdateRequest;
import com.webkorps.platform.training.module.service.DownloadedTrainingFile;
import com.webkorps.platform.training.module.service.TrainingModuleService;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.MissingServletRequestPartException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/v1")
public class TrainingModuleController {

    private final TrainingModuleService moduleService;

    public TrainingModuleController(TrainingModuleService moduleService) {
        this.moduleService = moduleService;
    }

    @GetMapping("/modules")
    public Page<TrainingModuleResponse> getPublishedModules(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Long domainId,
            @RequestParam(required = false) String search) {
        return moduleService.getPublishedModules(page, size, domainId, search);
    }

    @GetMapping("/modules/{id}")
    public TrainingModuleResponse getModule(
            @PathVariable Long id, Authentication authentication) {
        return moduleService.getModule(id, isManager(authentication));
    }

    @PostMapping("/manager/modules")
    @ResponseStatus(HttpStatus.CREATED)
    public TrainingModuleResponse createModule(
            @Valid @RequestBody TrainingModuleCreateRequest request,
            Authentication authentication) {
        return moduleService.createModule(request, authentication.getName());
    }

    @PostMapping(value = "/manager/modules/{id}/files", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public TrainingModuleFileResponse uploadPdf(
            @PathVariable Long id,
            @RequestPart("file") MultipartFile file,
            @RequestParam(value = "versionNote", required = false) String versionNote,
            Authentication authentication) {
        return moduleService.uploadPdf(id, file, versionNote, authentication.getName());
    }

    @PatchMapping("/manager/modules/{id}")
    public TrainingModuleResponse updateModule(
            @PathVariable Long id,
            @Valid @RequestBody TrainingModuleUpdateRequest request) {
        return moduleService.updateModule(id, request);
    }

    @PatchMapping("/manager/modules/{id}/publish")
    public TrainingModuleResponse publishModule(@PathVariable Long id) {
        return moduleService.publishModule(id);
    }

    @PatchMapping("/manager/modules/{id}/archive")
    public TrainingModuleResponse archiveModule(@PathVariable Long id) {
        return moduleService.archiveModule(id);
    }

    @GetMapping(value = "/modules/{id}/download", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<Resource> downloadPdf(
            @PathVariable Long id, Authentication authentication) {
        DownloadedTrainingFile file = moduleService.getLatestPdf(id, isManager(authentication));
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentLength(file.sizeBytes());
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename(file.originalFilename(), StandardCharsets.UTF_8)
                .build());
        return ResponseEntity.ok().headers(headers).body(file.resource());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationFailure(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getDefaultMessage())
                .findFirst()
                .orElse("Request validation failed");
        return badRequest(message);
    }

    @ExceptionHandler(MissingServletRequestPartException.class)
    public ResponseEntity<ApiError> handleMissingMultipartPart(MissingServletRequestPartException exception) {
        return badRequest("The file multipart field is required");
    }

    private boolean isManager(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_MANAGER"));
    }

    private ResponseEntity<ApiError> badRequest(String message) {
        ApiError error = new ApiError(HttpStatus.BAD_REQUEST.value(), "Bad Request", message);
        return ResponseEntity.badRequest().body(error);
    }
}
