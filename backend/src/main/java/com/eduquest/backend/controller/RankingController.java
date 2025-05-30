package com.eduquest.backend.controller;

import com.eduquest.backend.model.Ranking;
import com.eduquest.backend.service.RankingService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/ranking")
public class RankingController {

    private final RankingService rankingService;

    public RankingController(RankingService rankingService) {
        this.rankingService = rankingService;
    }

    @GetMapping
    public List<Ranking> getRanking() {
        return rankingService.getAllRanking();
    }

   @GetMapping("/me")
    public Ranking getMyRanking(Principal principal) {
        String email = principal.getName(); // email desde el token

        UUID userId = rankingService.getUserIdByEmail(email);

        return rankingService.getRankingByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Ranking del usuario no encontrado"));
    }
}
