package com.example.lab3.bean;

import com.example.lab3.models.Shot;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Named;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Persistence;

import java.util.List;

@Named("ShotDAO")
@ApplicationScoped
public class ShotDAO {
    private final EntityManager em =
            Persistence.createEntityManagerFactory("postgres").createEntityManager();

    public List<Shot> getShots() {
        return em.createQuery("SELECT s FROM Shot s", Shot.class).getResultList();
    }


    public void addShot(Shot shot) {
        em.getTransaction().begin();
        em.persist(shot);
        em.getTransaction().commit();
    }
}
