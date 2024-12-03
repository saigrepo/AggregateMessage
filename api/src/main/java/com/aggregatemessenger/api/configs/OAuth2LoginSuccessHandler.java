package com.aggregatemessenger.api.configs;

import com.aggregatemessenger.api.model.User;
import com.aggregatemessenger.api.repository.UserRepository;
import com.aggregatemessenger.api.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Value("${frontend.url}")
    private String frontEndUrl;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        Optional<User> user = userRepository.findByEmailId(email);
        String token = "";
        if(user.isEmpty()) {
            User newUser = new User();
            newUser.setEmailId(email);
            token = jwtService.generateToken(newUser);
        } else {
            token = jwtService.generateToken(user.get());
        }
        /// Redirect to frontend with token
        getRedirectStrategy().sendRedirect(request, response,
                frontEndUrl + "/oauth2/redirect?token=" + token);
    }
}
