package com.eduquest.backend.dto;

import java.util.UUID;

public class RetoReclamarDto {
    private int idReto;
    private String tipo;
    private int xpRecompensa;


    public int getIdReto() { return idReto; }
    public void setIdReto(int idReto) { this.idReto = idReto; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public int getXpRecompensa() { return xpRecompensa; }
    public void setXpRecompensa(int xpRecompensa) { this.xpRecompensa = xpRecompensa; }
}
