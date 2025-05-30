package com.eduquest.backend.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "ranking")
public class Ranking {

    @Id
    @Column(name = "id_usuario", columnDefinition = "uuid")
    private UUID idusuario;

    @Column(name = "username")
    private String username;

    @Column(name = "nivel")
    private int nivel;

    @Column(name = "xp_total")
    private int xp_total;

    @Column(name = "posicion")
    private int posicion;

    @Column(name = "xp_para_siguiente_nivel")
    private int xp_para_siguiente_nivel;

    // Getters y setters

    public UUID getIdusuario() {
        return idusuario;
    }

    public void setIdusuario(UUID idusuario) {
        this.idusuario = idusuario;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getNivel() {
        return nivel;
    }

    public void setNivel(int nivel) {
        this.nivel = nivel;
    }

    public int getXp_total() {
        return xp_total;
    }

    public void setXp_total(int xp_total) {
        this.xp_total = xp_total;
    }

    public int getPosicion() {
        return posicion;
    }

    public void setPosicion(int posicion) {
        this.posicion = posicion;
    }

     public int getXp_para_siguiente_nivel() {
        return xp_para_siguiente_nivel;
    }

    public void setXp_para_siguiente_nivel(int xp_para_siguiente_nivel) {
        this.xp_para_siguiente_nivel = xp_para_siguiente_nivel;
    }
}
