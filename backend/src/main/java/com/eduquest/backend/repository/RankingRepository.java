package com.eduquest.backend.repository;

import com.eduquest.backend.model.Ranking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RankingRepository extends JpaRepository<Ranking, UUID> {
    Optional<Ranking> findByIdusuario(UUID idusuario);
}
