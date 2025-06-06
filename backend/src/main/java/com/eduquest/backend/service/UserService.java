package com.eduquest.backend.service;

import com.eduquest.backend.model.User;
import com.eduquest.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Obtiene un usuario por su ID.
     */
    public Optional<User> getUserById(UUID id) {
        return userRepository.findById(id);
    }

    /**
     * Obtiene un usuario por su email.
     */
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Verifica si la contraseña raw coincide con la encriptada almacenada.
     */
    public boolean checkPassword(User user, String rawPassword) {
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }

    /**
     * Actualiza datos de usuario: username y contraseña (si se da).
     * No actualiza email (comentado por decisión).
     * Si se quiere cambiar la contraseña, se debe validar la contraseña vieja.
     */
    @Transactional
    public User updateUser(UUID id_usuario, String username, String email, String newPassword, String oldPassword) {
        User user = userRepository.findById(id_usuario)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (username != null && !username.isBlank()) {
            user.setUsername(username);
        }

        // Por ahora se evita actualizar email para evitar problemas
        // if (email != null && !email.isBlank()) {
        //     user.setEmail(email);
        // }

        if (newPassword != null && !newPassword.isBlank()) {
            // Validar que la contraseña antigua sea correcta
            if (oldPassword == null || oldPassword.isBlank() || !passwordEncoder.matches(oldPassword, user.getPassword())) {
                throw new RuntimeException("Contraseña actual incorrecta");
            }
            // Encriptar y guardar la nueva contraseña
            user.setPassword(passwordEncoder.encode(newPassword));
        } else {
            // Si solo se recibe oldPassword sin nueva, lanzar error
            if (oldPassword != null && !oldPassword.isBlank()) {
                throw new RuntimeException("Debe proporcionar una nueva contraseña si desea cambiarla");
            }
        }

        return userRepository.save(user);
    }

}
