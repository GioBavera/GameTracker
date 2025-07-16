package com.registro.gametracker.models;

public class EstadisticasGenerales {
    private int totalJuegos;
    private int completadosJuegos;
    private int horas;
    private String puntajePromedio;
    private String plataformaPopular;
    private int annoActivo;
    private float porcentajeTerminado;
    private int promedioHoras;

    public void setTotalJuegos(int totalJuegos) {
        this.totalJuegos = totalJuegos;
    }

    public void setCompletadosJuegos(int completadosJuegos) {
        this.completadosJuegos = completadosJuegos;
    }

    public void setPuntajePromedio(String puntajePromedio) {
        this.puntajePromedio = puntajePromedio;
    }

    public void setHoras(int horas) {
        this.horas = horas;
    }

    public void setPlataformaPopular(String plataformaPopular) {
        this.plataformaPopular = plataformaPopular;
    }

    public void setAnnoActivo(int annoActivo) {
        this.annoActivo = annoActivo;
    }

    public void setPorcentajeTerminado(float porcentajeTerminado) {
        this.porcentajeTerminado = porcentajeTerminado;
    }

    public void setPromedioHoras(int promedioHoras) {
        this.promedioHoras = promedioHoras;
    }

    public int getTotalJuegos() {
        return totalJuegos;
    }

    public int getCompletadosJuegos() {
        return completadosJuegos;
    }

    public int getHoras() {
        return horas;
    }

    public String getPuntajePromedio() {
        return puntajePromedio;
    }

    public String getPlataformaPopular() {
        return plataformaPopular;
    }

    public int getAnnoActivo() {
        return annoActivo;
    }

    public float getPorcentajeTerminado() {
        return porcentajeTerminado;
    }

    public int getPromedioHoras() {
        return promedioHoras;
    }
}
