package com.eduquest.backend.controller;

import java.security.Principal;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.eduquest.backend.service.AuthService;
import com.eduquest.backend.service.ExperienciaService;

@RestController
@RequestMapping("/api/experiencia")
public class ExperienciaController {

    private final ExperienciaService experienciaService;
    private final AuthService authService;

    @Autowired
    public ExperienciaController(ExperienciaService experienciaService, AuthService authService) {
        this.experienciaService = experienciaService;
        this.authService = authService;
    }

    /**
     * Endpoint para registrar experiencia ganada por el usuario.
     * Recibe la cantidad de XP, valida usuario y llama al servicio para actualizar experiencia.
     */
    @PostMapping("/ganar")
    public ResponseEntity<?> ganarExperiencia(
        @RequestBody Map<String, Integer> body,
        Principal principal
    ) {
        try {
            Integer xpGanada = body.get("xpGanada");
            if (xpGanada == null) {
                return ResponseEntity.badRequest().body("El campo xpGanada es obligatorio");
            }

            // Obtiene email del usuario autenticado
            String email = principal.getName();
            // Recupera UUID del usuario mediante email
            UUID idUsuario = authService.getIdUsuarioByEmail(email);

            if (idUsuario == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no identificado");
            }

            // Actualiza experiencia ganada para el usuario
            experienciaService.ganarExperiencia(idUsuario, xpGanada);
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            e.printStackTrace(); // Log del error para debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error interno del servidor: " + e.getMessage());
        }
    }
}
