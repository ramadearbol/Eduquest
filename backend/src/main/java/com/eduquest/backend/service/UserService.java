package com.eduquest.backend.service;

import com.eduquest.backend.dto.UserDto;
import com.eduquest.backend.model.User;
import com.eduquest.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Optional<User> getUserById(UUID id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean checkPassword(User user, String rawPassword) {
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }

    @Transactional
    public User updateUser(UUID id_usuario, String username, String email, String newPassword, String oldPassword) {
        User user = userRepository.findById(id_usuario)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (username != null && !username.isBlank()) {
            user.setUsername(username);
        }

        // Eliminar o comentar esta parte para NO actualizar el email
        // if (email != null && !email.isBlank()) {
        //     user.setEmail(email);
        // }

        if (newPassword != null && !newPassword.isBlank()) {
            if (oldPassword == null || oldPassword.isBlank() || !passwordEncoder.matches(oldPassword, user.getPassword())) {
                throw new RuntimeException("Contraseña actual incorrecta");
            }
            user.setPassword(passwordEncoder.encode(newPassword));
        } else {
            if (oldPassword != null && !oldPassword.isBlank()) {
                throw new RuntimeException("Debe proporcionar una nueva contraseña si desea cambiarla");
            }
        }

        return userRepository.save(user);
    }

}
