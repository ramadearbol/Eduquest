package com.eduquest.backend.service;

import com.eduquest.backend.model.Ranking;
import com.eduquest.backend.model.User;
import com.eduquest.backend.repository.RankingRepository;
import com.eduquest.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.retry.annotation.Recover;

@Service
public class RankingService {

    private final RankingRepository rankingRepository;
    private final UserRepository userRepository;

    // Constructor para inyección de dependencias
    public RankingService(RankingRepository rankingRepository, UserRepository userRepository) {
        this.rankingRepository = rankingRepository;
        this.userRepository = userRepository;
    }

    /**
     * Obtiene todos los rankings.
     * Se reintentará hasta 5 veces con un delay de 500 ms si ocurre alguna excepción.
     */
    @Retryable(
        value = Exception.class,
        maxAttempts = 10,
        backoff = @Backoff(delay = 500)
    )
    public List<Ranking> getAllRanking() {
        return rankingRepository.findAll();
    }

    /**
     * Obtiene un ranking por el ID de usuario.
     * Se reintentará hasta 3 veces con un delay de 500 ms si ocurre alguna excepción.
     */
    @Retryable(
        value = Exception.class,
        maxAttempts = 3,
        backoff = @Backoff(delay = 500)
    )
    public Optional<Ranking> getRankingByUserId(UUID userId) {
        return rankingRepository.findByIdusuario(userId);
    }

    /**
     * Obtiene el UUID del usuario dado su email.
     * Lanza excepción si no se encuentra el usuario.
     */
    public UUID getUserIdByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + email));
    }

    /**
     * Método recover para getAllRanking.
     * Se ejecuta si después de todos los reintentos sigue fallando.
     */
    @Recover
    public List<Ranking> recoverGetAllRanking(Exception e) {
        System.err.println("Error crítico en getAllRanking: " + e.getMessage());
        return List.of(); // Puedes cambiar para lanzar una excepción si prefieres
    }

    /**
     * Método recover para getRankingByUserId.
     * Se ejecuta si después de todos los reintentos sigue fallando.
     */
    @Recover
    public Optional<Ranking> recoverGetRankingByUserId(Exception e, UUID userId) {
        System.err.println("Error crítico en getRankingByUserId: " + e.getMessage());
        return Optional.empty(); // Puedes cambiar para lanzar una excepción si prefieres
    }
}
