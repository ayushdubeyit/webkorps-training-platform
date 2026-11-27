package com.webkorps.platform.training.module.service;

import com.webkorps.platform.common.exception.InvalidTrainingFileException;
import com.webkorps.platform.common.exception.ResourceNotFoundException;
import com.webkorps.platform.common.exception.TrainingFileStorageException;
import com.webkorps.platform.common.exception.TrainingFileTooLargeException;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.unit.DataSize;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.Locale;
import java.util.UUID;

@Service
public class TrainingFileStorageService {

    private static final Logger LOGGER = LoggerFactory.getLogger(TrainingFileStorageService.class);
    private static final String PDF_MIME_TYPE = "application/pdf";
    private static final int PDF_HEADER_SEARCH_BYTES = 1024;

    private final Path rootDirectory;
    private final long maxFileSizeBytes;

    public TrainingFileStorageService(
            @Value("${app.training.file-storage.location:./data/training-files}") String location,
            @Value("${app.training.file-storage.max-file-size:10MB}") DataSize maxFileSize) {
        this.rootDirectory = Path.of(location).toAbsolutePath().normalize();
        this.maxFileSizeBytes = maxFileSize.toBytes();
    }

    @PostConstruct
    void initialize() {
        ensureOutsidePublicDirectories();
        try {
            Files.createDirectories(rootDirectory);
            if (!Files.isDirectory(rootDirectory) || !Files.isWritable(rootDirectory)) {
                throw new TrainingFileStorageException("Training file storage is not writable");
            }
        } catch (IOException exception) {
            throw new TrainingFileStorageException("Unable to initialize training file storage", exception);
        }
    }

    public StoredTrainingFile store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidTrainingFileException("A non-empty PDF file is required");
        }
        if (file.getSize() > maxFileSizeBytes) {
            throw tooLarge();
        }

        String originalFilename = sanitizeFilename(file.getOriginalFilename());
        if (!originalFilename.toLowerCase(Locale.ROOT).endsWith(".pdf")) {
            throw new InvalidTrainingFileException("File extension must be .pdf");
        }
        if (!PDF_MIME_TYPE.equalsIgnoreCase(file.getContentType())) {
            throw new InvalidTrainingFileException("File MIME type must be application/pdf");
        }
        validatePdfHeader(file);

        String storageKey = UUID.randomUUID() + ".pdf";
        Path destination = resolveStorageKey(storageKey);
        MessageDigest digest = sha256Digest();
        long bytesWritten = 0;
        try (InputStream input = file.getInputStream();
             OutputStream output = Files.newOutputStream(destination, StandardOpenOption.CREATE_NEW,
                     StandardOpenOption.WRITE)) {
            byte[] buffer = new byte[8192];
            int count;
            while ((count = input.read(buffer)) != -1) {
                bytesWritten += count;
                if (bytesWritten > maxFileSizeBytes) {
                    throw tooLarge();
                }
                digest.update(buffer, 0, count);
                output.write(buffer, 0, count);
            }
        } catch (TrainingFileTooLargeException exception) {
            deletePartialFile(destination);
            throw exception;
        } catch (IOException exception) {
            deletePartialFile(destination);
            throw new TrainingFileStorageException("Unable to store training PDF", exception);
        }

        return new StoredTrainingFile(storageKey, originalFilename, bytesWritten,
                HexFormat.of().formatHex(digest.digest()));
    }

    public Resource loadAsResource(String storageKey) {
        Path file = resolveStorageKey(storageKey);
        if (!Files.isRegularFile(file) || !Files.isReadable(file)) {
            throw new ResourceNotFoundException("Training PDF file was not found");
        }
        return new FileSystemResource(file);
    }

    public void deleteQuietly(String storageKey) {
        try {
            Files.deleteIfExists(resolveStorageKey(storageKey));
        } catch (IOException | TrainingFileStorageException exception) {
            LOGGER.warn("Unable to clean up an unreferenced training PDF", exception);
        }
    }

    private String sanitizeFilename(String originalFilename) {
        if (originalFilename == null || originalFilename.isBlank()) {
            throw new InvalidTrainingFileException("Original PDF filename is required");
        }
        String normalizedSeparators = originalFilename.replace('\\', '/');
        String filename = normalizedSeparators.substring(normalizedSeparators.lastIndexOf('/') + 1)
                .replaceAll("[\\r\\n\\p{Cntrl}]", "_")
                .trim();
        if (filename.isBlank() || filename.equals(".") || filename.equals("..")) {
            throw new InvalidTrainingFileException("Original PDF filename is invalid");
        }
        if (filename.length() > 255) {
            throw new InvalidTrainingFileException("Filename must be at most 255 characters");
        }
        return filename;
    }

    private void validatePdfHeader(MultipartFile file) {
        try (InputStream input = file.getInputStream()) {
            byte[] prefix = input.readNBytes(PDF_HEADER_SEARCH_BYTES);
            for (int i = 0; i <= prefix.length - 5; i++) {
                if (prefix[i] == '%' && prefix[i + 1] == 'P' && prefix[i + 2] == 'D'
                        && prefix[i + 3] == 'F' && prefix[i + 4] == '-') {
                    return;
                }
            }
        } catch (IOException exception) {
            throw new TrainingFileStorageException("Unable to read uploaded training PDF", exception);
        }
        throw new InvalidTrainingFileException("Uploaded file does not have a valid PDF header");
    }

    private Path resolveStorageKey(String storageKey) {
        if (storageKey == null || !storageKey.matches(
                "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\\.pdf$")) {
            throw new TrainingFileStorageException("Invalid stored training file reference");
        }
        Path resolved = rootDirectory.resolve(storageKey).normalize();
        if (!resolved.startsWith(rootDirectory)) {
            throw new TrainingFileStorageException("Invalid stored training file reference");
        }
        return resolved;
    }

    private void ensureOutsidePublicDirectories() {
        Path workingDirectory = Path.of("").toAbsolutePath().normalize();
        Path[] publicDirectories = {
                workingDirectory.resolve("static"),
                workingDirectory.resolve("public"),
                workingDirectory.resolve("src/main/resources/static"),
                workingDirectory.resolve("src/main/resources/public")
        };
        for (Path publicDirectory : publicDirectories) {
            if (rootDirectory.startsWith(publicDirectory.normalize())) {
                throw new IllegalArgumentException("Training file storage must be outside public static directories");
            }
        }
    }

    private MessageDigest sha256Digest() {
        try {
            return MessageDigest.getInstance("SHA-256");
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable", exception);
        }
    }

    private TrainingFileTooLargeException tooLarge() {
        return new TrainingFileTooLargeException("PDF exceeds the configured maximum file size");
    }

    private void deletePartialFile(Path file) {
        try {
            Files.deleteIfExists(file);
        } catch (IOException exception) {
            LOGGER.warn("Unable to remove an incomplete training PDF", exception);
        }
    }
}
