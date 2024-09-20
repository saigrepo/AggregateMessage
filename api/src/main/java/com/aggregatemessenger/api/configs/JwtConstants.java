package com.aggregatemessenger.api.configs;

import org.springframework.beans.factory.annotation.Value;

public class JwtConstants {

    private JwtConstants() {
    }

    public static final String TOKEN_HEADER = "Authorization";
    public static final String EMAIL = "email";
    public static final String TOKEN_PREFIX = "Bearer ";
    static final String ISSUER = "aggregate-messenger-api";
    static final String AUTHORITIES = "authorities";

    @Value("${security.jwt.expiration-time}")
    static String SECRET_KEY;

    @Value("${security.jwt.expiration-time}")
    static long ACCESS_TOKEN_VALIDITY;
}
