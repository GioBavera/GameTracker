package com.registro.gametracker.models;

import java.util.List;

public class GraficoPlataformas {
    private List<String> labels;
    private List<Long> data;

    public GraficoPlataformas(List<String> labels, List<Long> data) {
        this.labels = labels;
        this.data = data;
    }

    public List<String> getLabels() {
        return labels;
    }

    public void setLabels(List<String> labels) {
        this.labels = labels;
    }

    public List<Long> getData() {
        return data;
    }

    public void setData(List<Long> data) {
        this.data = data;
    }
}
