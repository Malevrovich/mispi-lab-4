package com.example.lab3.bean;

import com.example.lab3.jmx.ShotCounter;
import com.example.lab3.util.HitProcessor;
import com.example.lab3.util.ShotValidator;
import com.example.lab3.models.Shot;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;

import java.util.List;

@Named("ShotBean")
@ApplicationScoped
public class ShotBean {
    @Inject
    private @Named("ShotValidator") ShotValidator validator;
    @Inject
    private ShotDAO dao;
    @Inject
    private HitProcessor hitProcessor;
    @Inject
    private ShotCounter shotCounter;

    float x;
    float y;
    int r = 1;

    public List<Shot> shotByRequest(String x, String y, String r) {
        validator.validateParameters(x, y, r);
        if(!validator.getValid()) return List.of();

        float x_val = Float.parseFloat(x);
        float y_val = Float.parseFloat(y);
        int r_val = Integer.parseInt(r);

        shot(x_val, y_val, r_val);

        return dao.getShots();
    }

    public void shot(float x, float y, int r) {
        Shot shotObj = new Shot(x, y, r, hitProcessor.processHit(x, y, r));
        dao.addShot(shotObj);
        shotCounter.registerShot(shotObj);
    }

    public void shot() {
        shot(x, y, r);
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
}
