package com.eduquest.backend.service;

import com.eduquest.backend.model.Ranking;
import com.eduquest.backend.model.User;
import com.eduquest.backend.repository.RankingRepository;
import com.eduquest.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class RankingService {

    private final RankingRepository rankingRepository;
    private final UserRepository userRepository;

    public RankingService(RankingRepository rankingRepository, UserRepository userRepository) {
        this.rankingRepository = rankingRepository;
        this.userRepository = userRepository;
    }

    public List<Ranking> getAllRanking() {
        try {
            return rankingRepository.findAll();
        } catch (Exception e) {
            System.err.println("Error en getAllRanking, reintentando... " + e.getMessage());
            try { Thread.sleep(500); } catch (InterruptedException ignored) {}
            return rankingRepository.findAll();
        }
    }

    public Optional<Ranking> getRankingByUserId(UUID userId) {
        try {
            return rankingRepository.findByIdusuario(userId);
        } catch (Exception e) {
            System.err.println("Error en getRankingByUserId, reintentando... " + e.getMessage());
            try { Thread.sleep(500); } catch (InterruptedException ignored) {}
            return rankingRepository.findByIdusuario(userId);
        }
    }

    public UUID getUserIdByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + email));
    }
}
