package com.example.lab3.models;


import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name = "shot")
public class Shot implements Serializable {
    @Id
    @GeneratedValue
    public long id;

    public float x;

    public float y;

    public int r;

    public boolean shot;

    public Shot(float x, float y, int r, boolean shot) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.shot = shot;
    }

    public Shot() {
        x = 0;
        y = 0;
        r = 0;
        shot = true;
    }

    public float getX() {
        return x;
    }

    public void setX(float x) {
        this.x = x;
    }

    public float getY() {
        return y;
    }

    public void setY(float y) {
        this.y = y;
    }

    public int getR() {
        return r;
    }

    public void setR(int r) {
        this.r = r;
    }

    public boolean isShot() {
        return shot;
    }

    public void setShot(boolean shot) {
        this.shot = shot;
    }
}
