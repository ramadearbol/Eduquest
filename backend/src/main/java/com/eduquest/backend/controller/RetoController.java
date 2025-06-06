package com.eduquest.backend.controller;

import com.eduquest.backend.dto.RetoDto;
import com.eduquest.backend.dto.RetoReclamarDto;
import com.eduquest.backend.model.User;
import com.eduquest.backend.service.AuthService;
import com.eduquest.backend.service.ExperienciaService;
import com.eduquest.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/retos")
public class RetoController {

    @Autowired
    private ExperienciaService experienciaService;

    @Autowired
    private UserService userService;
    
    @Autowired
    private AuthService authService;

    /**
     * Obtiene los retos del usuario autenticado.
     * @param principal Usuario autenticado
     * @return Mapa con listas de retos diarios y semanales
     */
    @GetMapping("/usuario")
    public Map<String, List<RetoDto>> getRetosUsuario(Principal principal) {
        User user = userService.getUserByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return experienciaService.obtenerRetosPorUsuario(user.getId());
    }

    /**
     * Reclama la recompensa de un reto específico.
     * @param dto DTO con datos del reto a reclamar
     * @param principal Usuario autenticado
     * @return Mensaje con resultado del reclamo
     */
    @PostMapping("/reclamar")
    public String reclamarReto(@RequestBody RetoReclamarDto dto, Principal principal) {
        String email = principal.getName();
        UUID idUsuario = authService.getIdUsuarioByEmail(email);

        if (idUsuario == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no identificado");
        }

        String resultado = experienciaService.reclamarReto(
            idUsuario,
            dto.getIdReto(),
            dto.getTipo(),
            dto.getXpRecompensa()
        );

        if ("YA_RECLAMADO".equals(resultado)) {
            return "Ya has reclamado este reto recientemente.";
        }

        return "Recompensa reclamada correctamente.";
    }

    /**
     * Actualiza el progreso del reto de "una hora de sesión" para el usuario.
     */
    @PostMapping("/hora")
    public void actualizarHoraSesion(Principal principal) {
        UUID idUsuario = authService.getIdUsuarioByEmail(principal.getName());
        experienciaService.actualizarRetoUnaHora(idUsuario);
    }

    /**
     * Marca el reto de completar una partida como completado.
     */
    @PostMapping("/completar/1partida")
    public void completarUnaPartida(Principal principal) {
        UUID idUsuario = authService.getIdUsuarioByEmail(principal.getName());
        experienciaService.actualizarRetoCompletarUnaPartida(idUsuario);
    }

    /**
     * Actualiza el progreso del reto de completar cinco partidas.
     */
    @PostMapping("/completar/5partidas")
    public void completarCincoPartidas(Principal principal) {
        UUID idUsuario = authService.getIdUsuarioByEmail(principal.getName());
        experienciaService.actualizarRetoCompletarCincoPartidas(idUsuario);
    }

    /**
     * Marca el reto de hacer una pregunta sin error como completado.
     */
    @PostMapping("/completar/1correcta")
    public void completarPreguntaCorrecta(Principal principal) {
        UUID idUsuario = authService.getIdUsuarioByEmail(principal.getName());
        experienciaService.actualizarRetoPreguntaSinError(idUsuario);
    }
}
