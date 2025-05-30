package com.eduquest.backend.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.eduquest.backend.model.User;
import com.eduquest.backend.repository.UserRepository;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserRepository userRepository;  // Lo añadimos para buscar el usuario

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2AuthenticationToken oAuth2AuthenticationToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oauth2User = oAuth2AuthenticationToken.getPrincipal();
        String email = oauth2User.getAttribute("email");

        // Buscar el usuario en BD para obtener UUID
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado en OAuth2"));

        String token = jwtTokenUtil.generateToken(email, user.getId());

        response.setHeader("Authorization", "Bearer " + token);
        response.getWriter().write("Bearer " + token);
    }
}
