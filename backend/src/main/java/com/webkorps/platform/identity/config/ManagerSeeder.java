
package com.webkorps.platform.identity.config;

import com.webkorps.platform.identity.entity.User;
import com.webkorps.platform.identity.entity.enums.AccountStatus;
import com.webkorps.platform.identity.entity.enums.UserRole;
import com.webkorps.platform.identity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class ManagerSeeder {

    @Value("${app.bootstrap.manager.name}")
    private String managerName;

    @Value("${app.bootstrap.manager.email}")
    private String managerEmail;

    @Value("${app.bootstrap.manager.password}")
    private String managerPassword;

    @Bean
    public CommandLineRunner seedManager(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            var existingUser = userRepository.findByEmail(managerEmail);

            if (existingUser.isPresent()) {

                User user = existingUser.get();

                if (user.getRole() != UserRole.MANAGER) {
                    throw new IllegalStateException(
                            "Bootstrap email already belongs to a non-manager account."
                    );
                }

                System.out.println("Manager account already exists. Skipping seeding.");
                return;
            }

            User manager = new User();

            manager.setFullName(managerName);
            manager.setEmail(managerEmail);
            manager.setPasswordHash(
                    passwordEncoder.encode(managerPassword)
            );
            manager.setRole(UserRole.MANAGER);
            manager.setAccountStatus(AccountStatus.APPROVED);

            userRepository.save(manager);

            System.out.println("Initial Manager account created successfully.");
        };
    }
}
