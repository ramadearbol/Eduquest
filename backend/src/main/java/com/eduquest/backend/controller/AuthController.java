package com.eduquest.backend.controller;

import com.eduquest.backend.dto.UserDto;
import com.eduquest.backend.service.AuthService;
import com.eduquest.backend.service.ExperienciaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private ExperienciaService experienciaService;

    /**
     * Endpoint para registrar un nuevo usuario.
     * Recibe datos, registra usuario, actualiza reto de login si es necesario, y devuelve token.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDto userDto) {
        try {
            String token = authService.register(userDto.getUsername(), userDto.getEmail(), userDto.getPassword());
            UUID idUsuario = authService.getIdUsuarioByEmail(userDto.getEmail());

            if (!experienciaService.estaRetoLoginCompletado(idUsuario)) {
                experienciaService.actualizarRetoLogin(idUsuario);
            }
            return ResponseEntity.ok(Map.of("token", token));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Endpoint para autenticar un usuario existente (login).
     * Verifica credenciales, actualiza reto de login si es necesario, y devuelve token.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDto userDto) {
        try {
            String token = authService.login(userDto.getEmail(), userDto.getPassword());
            UUID idUsuario = authService.getIdUsuarioByEmail(userDto.getEmail());

            if (!experienciaService.estaRetoLoginCompletado(idUsuario)) {
                experienciaService.actualizarRetoLogin(idUsuario);
            }
            return ResponseEntity.ok(Map.of("token", token));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
