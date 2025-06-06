package com.eduquest.backend.service;

import com.eduquest.backend.model.User;
import com.eduquest.backend.repository.UserRepository;
import com.eduquest.backend.security.JwtTokenUtil;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
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

    /**
     * Registra un nuevo usuario:
     * - Verifica si el email ya existe
     * - Codifica la contraseña
     * - Guarda el usuario en BD
     * - Genera y retorna un token JWT para el usuario registrado
     * 
     * Este método reintenta hasta 3 veces en caso de error (con delay)
     */
    @Transactional
    @Retryable(value = Exception.class, maxAttempts = 3, backoff = @Backoff(delay = 500))
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

    /**
     * Método de recuperación para register en caso de fallo persistente.
     * Lanza excepción indicando fallo tras varios intentos.
     */
    @Recover
    public String recoverRegister(Exception e, String username, String email, String rawPassword) {
        System.err.println("Error persistente al registrar usuario " + email + ": " + e.getMessage());
        throw new RuntimeException("No se pudo completar el registro después de varios intentos.");
    }

    /**
     * Método para login:
     * - Busca el usuario por email
     * - Verifica que la contraseña sea correcta
     * - Genera y retorna un token JWT
     * 
     * Reintenta hasta 3 veces en caso de error.
     */
    @Transactional(readOnly = true)
    @Retryable(value = Exception.class, maxAttempts = 3, backoff = @Backoff(delay = 500))
    public String login(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta.");
        }

        return jwtTokenUtil.generateToken(user.getEmail(), user.getId());
    }

    /**
     * Método de recuperación para login en caso de fallo persistente.
     * Lanza excepción indicando fallo tras varios intentos.
     */
    @Recover
    public String recoverLogin(Exception e, String email, String rawPassword) {
        System.err.println("Error persistente al iniciar sesión usuario " + email + ": " + e.getMessage());
        throw new RuntimeException("No se pudo iniciar sesión después de varios intentos.");
    }

    /**
     * Obtiene el UUID de un usuario dado su email.
     * Lanza excepción si no se encuentra el usuario.
     */
    @Transactional(readOnly = true)
    public UUID getIdUsuarioByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con email: " + email));
    }
}
