package com.webkorps.platform.identity.service;

import com.webkorps.platform.dto.LoginRequest;
import com.webkorps.platform.dto.LoginResponse;
import com.webkorps.platform.identity.entity.User;
import com.webkorps.platform.identity.entity.enums.AccountStatus;
import com.webkorps.platform.identity.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;


@Service
public class LoginService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public LoginService(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        if (user.getAccountStatus() != AccountStatus.APPROVED) {
            throw new IllegalStateException(
                    "Your account is awaiting manager approval."
            );
        }


        String token = jwtService.generateToken(user);

        return new LoginResponse(
                token,
                "Bearer",
                user.getId(),
                user.getEmail(),
                user.getRole()
        );
    }
}
