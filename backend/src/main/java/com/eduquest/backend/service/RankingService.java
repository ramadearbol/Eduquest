package com.eduquest.backend.service;

import com.eduquest.backend.model.Ranking;
import com.eduquest.backend.model.User;
import com.eduquest.backend.repository.RankingRepository;
import com.eduquest.backend.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class RankingService {

    private final RankingRepository rankingRepository;
    private final UserRepository userRepository;  // <-- agregar esto

    // Inyecta ambos repositorios en el constructor
    public RankingService(RankingRepository rankingRepository, UserRepository userRepository) {
        this.rankingRepository = rankingRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public List<Ranking> getAllRanking() {
        return rankingRepository.findAll();
    }

    @Transactional
    public Optional<Ranking> getRankingByUserId(UUID userId) {
        return rankingRepository.findByIdusuario(userId);
    }

    @Transactional
    public UUID getUserIdByEmail(String email) {
        return userRepository.findByEmail(email)   // <-- usar la instancia
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}
