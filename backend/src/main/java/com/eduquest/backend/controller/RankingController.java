package com.eduquest.backend.controller;

import com.eduquest.backend.model.Ranking;
import com.eduquest.backend.service.RankingService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/ranking")
public class RankingController {

    private final RankingService rankingService;

    // Constructor para inyectar el servicio de ranking
    public RankingController(RankingService rankingService) {
        this.rankingService = rankingService;
    }

    /**
     * Devuelve la lista completa de rankings.
     */
    @GetMapping
    public List<Ranking> getRanking() {
        return rankingService.getAllRanking();
    }

    /**
     * Devuelve el ranking del usuario autenticado, según el email del token.
     */
    @GetMapping("/me")
    public Ranking getMyRanking(Principal principal) {
        String email = principal.getName(); // Obtener email del usuario autenticado
        UUID userId = rankingService.getUserIdByEmail(email); // Obtener ID del usuario

        // Buscar ranking por usuario, lanzar error si no existe
        return rankingService.getRankingByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Ranking del usuario no encontrado"));
    }
}
