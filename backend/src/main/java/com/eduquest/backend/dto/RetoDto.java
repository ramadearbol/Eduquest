package com.eduquest.backend.dto;

public class RetoDto {
    private int idReto;
    private String descripcion;
    private int progresoActual;
    private int total;
    private boolean completado;
    private int xpRecompensa;
    private String tipo;

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public int getIdReto() { return idReto; }
    public void setIdReto(int idReto) { this.idReto = idReto; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public int getProgresoActual() { return progresoActual; }
    public void setProgresoActual(int progresoActual) { this.progresoActual = progresoActual; }

    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }

    public boolean isCompletado() { return completado; }
    public void setCompletado(boolean completado) { this.completado = completado; }

    public int getXpRecompensa() { return xpRecompensa; }
    public void setXpRecompensa(int xpRecompensa) { this.xpRecompensa = xpRecompensa; }
}
