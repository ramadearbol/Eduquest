package com.eduquest.backend.service;

import com.eduquest.backend.dto.RetoDto;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class ExperienciaService {

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Obtiene los retos diarios y semanales de un usuario.
     * Reintenta hasta 3 veces en caso de error con delay.
     */
    @Transactional(readOnly = true)
    @Retryable(value = Exception.class, maxAttempts = 10, backoff = @Backoff(delay = 500))
    public Map<String, List<RetoDto>> obtenerRetosPorUsuario(UUID idUsuario) {
        List<RetoDto> diarios = obtenerRetosPorTipoYUsuario(idUsuario, "diario");
        List<RetoDto> semanales = obtenerRetosPorTipoYUsuario(idUsuario, "semanal");

        Map<String, List<RetoDto>> map = new HashMap<>();
        map.put("diarios", diarios);
        map.put("semanales", semanales);
        return map;
    }

    /**
     * Método de recuperación si falla persistentemente la obtención de retos.
     * Devuelve mapas vacíos.
     */
    @Recover
    public Map<String, List<RetoDto>> recoverObtenerRetosPorUsuario(Exception e, UUID idUsuario) {
        System.err.println("Error persistente al obtener retos para usuario " + idUsuario + ": " + e.getMessage());
        return Map.of("diarios", Collections.emptyList(), "semanales", Collections.emptyList());
    }

    /**
     * Consulta nativa para obtener retos de un tipo específico para un usuario.
     */
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

    /**
     * Llama a procedimiento almacenado para reclamar un reto,
     * pasando usuario, reto, tipo y experiencia ganada.
     */
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

    /**
     * Llama a procedimiento almacenado para sumar experiencia a un usuario.
     */
    @Transactional
    public void ganarExperiencia(UUID idUsuario, int xpGanada) {
        try {
            Query query = entityManager.createNativeQuery(
                    "SELECT public.ganar_xp(:idUsuario, :xpGanada)"
            );
            query.setParameter("idUsuario", idUsuario);
            query.setParameter("xpGanada", xpGanada);
            query.getSingleResult();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error al ganar experiencia: " + e.getMessage());
        }
    }

    /**
     * Actualiza el progreso del reto "iniciar sesión" para un usuario.
     */
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

    /**
     * Verifica si el reto "iniciar sesión" está completado para un usuario.
     */
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

    /**
     * Actualiza el progreso del reto "una hora".
     */
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

    /**
     * Resetea los retos de un tipo (diario/semanal), eliminando progresos y retos completados,
     * y reinserta los retos para todos los usuarios.
     */
    @Transactional
    public void resetRetosPorTipo(String tipo) {
        entityManager.createNativeQuery(
                "DELETE FROM progreso_reto WHERE id_reto IN (SELECT id FROM retos WHERE tipo = :tipo)")
                .setParameter("tipo", tipo)
                .executeUpdate();

        entityManager.createNativeQuery(
                "DELETE FROM retos_completados WHERE id_reto IN (SELECT id FROM retos WHERE tipo = :tipo)")
                .setParameter("tipo", tipo)
                .executeUpdate();

        List<UUID> usuarios = entityManager.createNativeQuery("SELECT DISTINCT id_usuario FROM progreso_reto")
                .getResultList();

        List<Integer> retos = entityManager.createNativeQuery("SELECT id FROM retos WHERE tipo = :tipo")
                .setParameter("tipo", tipo)
                .getResultList();

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

    /**
     * Resetea los retos diarios a medianoche todos los días.
     */
    @Scheduled(cron = "0 0 0 * * ?")
    public void resetDiarios() {
        resetRetosPorTipo("diario");
    }

    /**
     * Resetea los retos semanales a medianoche todos los lunes.
     */
    @Scheduled(cron = "0 0 0 ? * MON")
    public void resetSemanales() {
        resetRetosPorTipo("semanal");
    }

    /**
     * Actualiza el reto "completar una partida" como completado para un usuario.
     */
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

    /**
     * Incrementa el progreso y marca como completado el reto de "completar 5 partidas".
     */
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

    /**
     * Marca como completado el reto "haz una pregunta sin error".
     */
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
