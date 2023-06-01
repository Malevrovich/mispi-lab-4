package com.example.lab3.jmx;

import jakarta.annotation.PreDestroy;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.context.Initialized;
import jakarta.enterprise.event.Observes;
import jakarta.enterprise.inject.Default;
import jakarta.inject.Inject;

@Default
@ApplicationScoped
public class ShotPercent implements ShotPercentMXBean{
    
    @Inject
    private JMXRegistrationBean jmxReg;
    
    @Inject
    private ShotCounterMXBean shotCounter;
    
    public void init(@Observes @Initialized(ApplicationScoped.class) Object pointless) {
        jmxReg.add(this, "Percentage");
    }
    
    @PreDestroy
    public void destroy() {
        jmxReg.remove(this);
    }

    @Override
    public float getHitPercent() {
        if(shotCounter.getShotCount() == 0) {
            return 0f;
        }
        return ((float) shotCounter.getHitCount()) / shotCounter.getShotCount() * 100;
    }
    
}
