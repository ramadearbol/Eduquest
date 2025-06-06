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

    public RankingService(RankingRepository rankingRepository, UserRepository userRepository) {
        this.rankingRepository = rankingRepository;
        this.userRepository = userRepository;
    }

    @Retryable(
        value = Exception.class,
        maxAttempts = 3,
        backoff = @Backoff(delay = 500)
    )
    public List<Ranking> getAllRanking() {
        return rankingRepository.findAll();
    }

    @Retryable(
        value = Exception.class,
        maxAttempts = 3,
        backoff = @Backoff(delay = 500)
    )
    public Optional<Ranking> getRankingByUserId(UUID userId) {
        return rankingRepository.findByIdusuario(userId);
    }

    public UUID getUserIdByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + email));
    }

    // Este método se invoca si todos los intentos de getAllRanking fallan
    @Recover
    public List<Ranking> recoverGetAllRanking(Exception e) {
        System.err.println("Error crítico en getAllRanking: " + e.getMessage());
        return List.of(); // o lanza una excepción si prefieres
    }

    // Este método se invoca si todos los intentos de getRankingByUserId fallan
    @Recover
    public Optional<Ranking> recoverGetRankingByUserId(Exception e, UUID userId) {
        System.err.println("Error crítico en getRankingByUserId: " + e.getMessage());
        return Optional.empty(); // o lanza una excepción si prefieres
    }
}
