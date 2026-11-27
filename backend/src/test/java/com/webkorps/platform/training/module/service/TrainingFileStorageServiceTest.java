package com.webkorps.platform.training.module.service;

import com.webkorps.platform.common.exception.InvalidTrainingFileException;
import com.webkorps.platform.common.exception.TrainingFileStorageException;
import com.webkorps.platform.common.exception.TrainingFileTooLargeException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.util.unit.DataSize;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class TrainingFileStorageServiceTest {

    @TempDir
    Path temporaryDirectory;

    private TrainingFileStorageService storageService;

    @BeforeEach
    void initializeStorage() {
        storageService = new TrainingFileStorageService(
                temporaryDirectory.resolve("private-pdfs").toString(), DataSize.ofBytes(1024));
        storageService.initialize();
    }

    @Test
    void storesPdfWithGeneratedKeyAndOnlySafeOriginalBasename() throws Exception {
        MockMultipartFile file = pdf("../../private/guide.pdf", validPdf(32));

        StoredTrainingFile stored = storageService.store(file);

        assertEquals("guide.pdf", stored.originalFilename());
        assertTrue(stored.storageKey().matches(
                "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\\.pdf$"));
        assertNotNull(stored.sha256());
        Path storedFile = temporaryDirectory.resolve("private-pdfs").resolve(stored.storageKey());
        assertTrue(Files.isRegularFile(storedFile));
        Resource resource = storageService.loadAsResource(stored.storageKey());
        assertEquals(Files.size(storedFile), resource.contentLength());
    }

    @Test
    void rejectsIncorrectExtensionMimeTypeAndPdfSignature() {
        assertThrows(InvalidTrainingFileException.class,
                () -> storageService.store(new MockMultipartFile("file", "guide.txt", "application/pdf",
                        validPdf(20))));
        assertThrows(InvalidTrainingFileException.class,
                () -> storageService.store(new MockMultipartFile("file", "guide.pdf", "text/plain",
                        validPdf(20))));
        assertThrows(InvalidTrainingFileException.class,
                () -> storageService.store(new MockMultipartFile("file", "guide.pdf", "application/pdf",
                        "not a PDF".getBytes())));
    }

    @Test
    void rejectsFilesAboveConfiguredLimit() {
        assertThrows(TrainingFileTooLargeException.class,
                () -> storageService.store(pdf("large.pdf", validPdf(2048))));
    }

    @Test
    void storedKeyCannotBeUsedForPathTraversal() {
        assertThrows(TrainingFileStorageException.class,
                () -> storageService.loadAsResource("../../application.properties"));
    }

    private MockMultipartFile pdf(String name, byte[] bytes) {
        return new MockMultipartFile("file", name, "application/pdf", bytes);
    }

    private byte[] validPdf(int length) {
        byte[] content = new byte[length];
        byte[] header = "%PDF-1.7\n".getBytes();
        System.arraycopy(header, 0, content, 0, header.length);
        return content;
    }
}
