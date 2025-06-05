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

    @GetMapping("/usuario")
    public Map<String, List<RetoDto>> getRetosUsuario(Principal principal) {
        User user = userService.getUserByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return experienciaService.obtenerRetosPorUsuario(user.getId());
    }

   @PostMapping("/reclamar")
    public String reclamarReto(@RequestBody RetoReclamarDto dto, Principal principal) {
        // Obtener el email del usuario autenticado
        String email = principal.getName();

        // Obtener el UUID del usuario con el método de authService
        UUID idUsuario = authService.getIdUsuarioByEmail(email);

        if (idUsuario == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no identificado");
        }

        // Ahora sí llamar al servicio con el idUsuario correcto
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

    @PostMapping("/hora")
    public void actualizarHoraSesion(Principal principal) {
        UUID idUsuario = authService.getIdUsuarioByEmail(principal.getName());
        experienciaService.actualizarRetoUnaHora(idUsuario);
    }

    @PostMapping("/completar/1partida")
    public void completarUnaPartida(Principal principal) {
        UUID idUsuario = authService.getIdUsuarioByEmail(principal.getName());
        experienciaService.actualizarRetoCompletarUnaPartida(idUsuario);
    }

    @PostMapping("/completar/5partidas")
    public void completarCincoPartidas(Principal principal) {
        UUID idUsuario = authService.getIdUsuarioByEmail(principal.getName());
        experienciaService.actualizarRetoCompletarCincoPartidas(idUsuario);
    }

    @PostMapping("/completar/1correcta")
    public void completarPreguntaCorrecta(Principal principal) {
        UUID idUsuario = authService.getIdUsuarioByEmail(principal.getName());
        experienciaService.actualizarRetoPreguntaSinError(idUsuario);
    }
}
