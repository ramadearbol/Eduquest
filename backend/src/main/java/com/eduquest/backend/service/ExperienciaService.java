package com.eduquest.backend.service;

import com.eduquest.backend.dto.RetoDto;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class ExperienciaService {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional(readOnly = true)
    public Map<String, List<RetoDto>> obtenerRetosPorUsuario(UUID idUsuario) {
        while (true) {
            try {
                List<RetoDto> diarios = obtenerRetosPorTipoYUsuario(idUsuario, "diario");
                List<RetoDto> semanales = obtenerRetosPorTipoYUsuario(idUsuario, "semanal");

                Map<String, List<RetoDto>> map = new HashMap<>();
                map.put("diarios", diarios);
                map.put("semanales", semanales);
                return map;
            } catch (Exception e) {
                System.err.println("Error al obtener retos. Reintentando... " + e.getMessage());
                try {
                    Thread.sleep(500); // Espera antes de reintentar
                } catch (InterruptedException ignored) {}
            }
        }
    }

    
    private List<RetoDto> obtenerRetosPorTipoYUsuario(UUID idUsuario, String tipo) {
       String sql = "SELECT r.id AS id_reto, r.descripcion, pr.progreso_actual, r.total, pr.completado, r.xp_recompensa, r.tipo " +
             "FROM retos r " +
             "JOIN progreso_reto pr ON r.id = pr.id_reto " +
             "WHERE pr.id_usuario = :idUsuario AND r.tipo = :tipo";

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("idUsuario", idUsuario);
        query.setParameter("tipo", tipo);

        List<Object[]> results = query.getResultList();
        List<RetoDto> lista = new ArrayList<>();

       for (Object[] row : results) {
            RetoDto dto = new RetoDto();
            dto.setIdReto((Integer) row[0]);
            dto.setDescripcion((String) row[1]);
            dto.setProgresoActual(((Number) row[2]).intValue());
            dto.setTotal(((Number) row[3]).intValue());
            dto.setCompletado((Boolean) row[4]);
            dto.setXpRecompensa(((Number) row[5]).intValue());
            dto.setTipo((String) row[6]); 
            lista.add(dto);
        }

        return lista;
    }

    @Transactional
   public String reclamarReto(UUID idUsuario, int idReto, String tipo, int xpGanada) {
        try {
            Query query = entityManager.createNativeQuery(
    "SELECT public.reclamar_reto(:idUsuario, :idReto, :tipo, :xpGanada)"
            );
            query.setParameter("idUsuario", idUsuario);
            query.setParameter("idReto", idReto);
            query.setParameter("tipo", tipo);
            query.setParameter("xpGanada", xpGanada);
            return (String) query.getSingleResult();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error en reclamo de reto: " + e.getMessage());
        }
    }

    @Transactional
    public void ganarExperiencia(UUID idUsuario, int xpGanada) {
        try {
            Query query = entityManager.createNativeQuery(
                "SELECT public.ganar_xp(:idUsuario, :xpGanada)"
            );
            query.setParameter("idUsuario", idUsuario);
            query.setParameter("xpGanada", xpGanada);
            query.getSingleResult();  // ok porque ahora devuelve un boolean
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error al ganar experiencia: " + e.getMessage());
        }
    }


    @Transactional
    public void actualizarRetoLogin(UUID idUsuario) {
        Query query = entityManager.createNativeQuery("""
            UPDATE progreso_reto
            SET progreso_actual = 1, completado = true
            WHERE id_usuario = :idUsuario
            AND id_reto = (
                SELECT id FROM retos 
                WHERE LOWER(descripcion) LIKE '%iniciar sesión%' LIMIT 1
            )
            AND completado = false
        """);
        query.setParameter("idUsuario", idUsuario);
        query.executeUpdate();
    }


    @Transactional
    public boolean estaRetoLoginCompletado(UUID idUsuario) {
        String sql = """
            SELECT pr.completado
            FROM progreso_reto pr
            JOIN retos r ON r.id = pr.id_reto
            WHERE pr.id_usuario = :idUsuario
            AND LOWER(r.descripcion) LIKE '%iniciar sesión%'
            LIMIT 1
        """;

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("idUsuario", idUsuario);
        Boolean result = (Boolean) query.getSingleResult();

        return Boolean.TRUE.equals(result);
    }


   @Transactional
    public void actualizarRetoUnaHora(UUID idUsuario) {
        Query query = entityManager.createNativeQuery("""
            UPDATE progreso_reto
            SET progreso_actual = progreso_actual + 1,
                completado = progreso_actual + 1 >= (
                    SELECT total FROM retos WHERE id = progreso_reto.id_reto
                )
            WHERE id_usuario = :idUsuario
            AND id_reto = (
                SELECT id FROM retos WHERE LOWER(descripcion) LIKE '%1 hora%' LIMIT 1
            )
            AND completado = false
        """);
        query.setParameter("idUsuario", idUsuario);
        query.executeUpdate();
    }

    @Transactional
    public void resetRetosPorTipo(String tipo) {
        // Borrar progreso para retos de tipo dado
        entityManager.createNativeQuery(
            "DELETE FROM progreso_reto WHERE id_reto IN (SELECT id FROM retos WHERE tipo = :tipo)")
            .setParameter("tipo", tipo)
            .executeUpdate();

        // Borrar retos completados para retos de tipo dado
        entityManager.createNativeQuery(
            "DELETE FROM retos_completados WHERE id_reto IN (SELECT id FROM retos WHERE tipo = :tipo)")
            .setParameter("tipo", tipo)
            .executeUpdate();

        // Obtener usuarios
        List<UUID> usuarios = entityManager.createNativeQuery("SELECT DISTINCT id_usuario FROM progreso_reto")
                                        .getResultList();

        // Obtener retos de tipo
        List<Integer> retos = entityManager.createNativeQuery("SELECT id FROM retos WHERE tipo = :tipo")
                                        .setParameter("tipo", tipo)
                                        .getResultList();

        // Insertar progreso 0 para todos los usuarios en cada reto
        for (UUID usuario : usuarios) {
            for (Integer reto : retos) {
                entityManager.createNativeQuery(
                    "INSERT INTO progreso_reto (id_usuario, id_reto, progreso_actual, completado) VALUES (:idUsuario, :idReto, 0, false) ON CONFLICT DO NOTHING")
                    .setParameter("idUsuario", usuario)
                    .setParameter("idReto", reto)
                    .executeUpdate();
            }
        }
    }

    // Scheduler para reset diario a medianoche
    @Scheduled(cron = "0 0 0 * * ?")
    public void resetDiarios() {
        resetRetosPorTipo("diario");
    }

    // Scheduler para reset semanal (lunes a medianoche)
    @Scheduled(cron = "0 0 0 ? * MON")
    public void resetSemanales() {
        resetRetosPorTipo("semanal");
    }

    @Transactional
    public void actualizarRetoCompletarUnaPartida(UUID idUsuario) {
        Query query = entityManager.createNativeQuery("""
            UPDATE progreso_reto
            SET progreso_actual = 1,
                completado = true
            WHERE id_usuario = :idUsuario
            AND id_reto = (
                SELECT id FROM retos 
                WHERE LOWER(descripcion) LIKE '%completar una partida%' LIMIT 1
            )
            AND completado = false
        """);
        query.setParameter("idUsuario", idUsuario);
        query.executeUpdate();
    }

    @Transactional
    public void actualizarRetoCompletarCincoPartidas(UUID idUsuario) {
        Query query = entityManager.createNativeQuery("""
            UPDATE progreso_reto
            SET progreso_actual = progreso_actual + 1,
                completado = progreso_actual + 1 >= (
                    SELECT total FROM retos WHERE id = progreso_reto.id_reto
                )
            WHERE id_usuario = :idUsuario
            AND id_reto = (
                SELECT id FROM retos 
                WHERE LOWER(descripcion) LIKE '%completar 5 partidas%' LIMIT 1
            )
            AND completado = false
        """);
        query.setParameter("idUsuario", idUsuario);
        query.executeUpdate();
    }

    @Transactional
    public void actualizarRetoPreguntaSinError(UUID idUsuario) {
        Query query = entityManager.createNativeQuery("""
            UPDATE progreso_reto
            SET progreso_actual = 1,
                completado = true
            WHERE id_usuario = :idUsuario
            AND id_reto = (
                SELECT id FROM retos 
                WHERE LOWER(descripcion) LIKE '%haz una pregunta sin error%' LIMIT 1
            )
            AND completado = false
        """);
        query.setParameter("idUsuario", idUsuario);
        query.executeUpdate();
    }
}
