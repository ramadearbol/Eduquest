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

            String email = principal.getName();
            UUID idUsuario = authService.getIdUsuarioByEmail(email);

            if (idUsuario == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no identificado");
            }

            experienciaService.ganarExperiencia(idUsuario, xpGanada);
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            e.printStackTrace(); // Para ver el error completo en consola
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error interno del servidor: " + e.getMessage());
        }
    }

}
