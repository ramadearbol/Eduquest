package com.eduquest.backend.service;

import com.eduquest.backend.model.User;
import com.eduquest.backend.repository.UserRepository;
import com.eduquest.backend.security.JwtTokenUtil;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    public String register(String username, String email, String rawPassword) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("El correo ya está registrado.");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        userRepository.save(user);

        return jwtTokenUtil.generateToken(user.getEmail(), user.getId());
    }

    public String login(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta.");
        }

        return jwtTokenUtil.generateToken(user.getEmail(), user.getId());
    }

    @Transactional
    public UUID getIdUsuarioByEmail(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            return userOpt.get().getId(); // Asumo que tu entidad User tiene getId() que devuelve UUID
        } else {
            throw new RuntimeException("Usuario no encontrado con email: " + email);
        }
    }
}
