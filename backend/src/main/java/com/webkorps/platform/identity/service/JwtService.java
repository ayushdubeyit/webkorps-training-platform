package com.webkorps.platform.identity.service;


import com.webkorps.platform.identity.entity.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {


    private final SecretKey signingKey;
    private final long expiration;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration}") long expiration) {

        this.signingKey = Keys.hmacShaKeyFor(
                Decoders.BASE64.decode(secret)
        );

        this.expiration = expiration;
    }

    public String generateToken(User user) {

        Date now = new Date();
        Date expiry = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .subject(user.getEmail())
                .claim("userId", user.getId())
                .claim("role", user.getRole().name())
                .issuedAt(now)
                .expiration(expiry)
                .signWith(signingKey)
                .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }


    public boolean isTokenValid(String token, User user) {
        try {
            String email = extractEmail(token);

            boolean emailMatches = email.equals(user.getEmail());

            Date expiry = Jwts.parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getExpiration();

            boolean notExpired = expiry.after(new Date());

            System.out.println("JWT email matches: " + emailMatches);
            System.out.println("JWT not expired: " + notExpired);
            System.out.println("JWT user status: " + user.getAccountStatus());
            System.out.println("JWT user role: " + user.getRole());

            return emailMatches && notExpired;

        } catch (Exception ex) {
            System.err.println("JWT validation failed: "
                    + ex.getClass().getSimpleName()
                    + " - " + ex.getMessage());

            return false;
        }
    }

}
