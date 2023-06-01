package com.example.lab3.jmx;

import com.example.lab3.models.Shot;
import com.example.lab3.util.HitProcessor;
import jakarta.annotation.PreDestroy;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.context.Initialized;
import jakarta.enterprise.event.Observes;
import jakarta.enterprise.inject.Default;
import jakarta.inject.Inject;
import javax.management.ListenerNotFoundException;
import javax.management.MBeanNotificationInfo;
import javax.management.Notification;
import javax.management.NotificationBroadcaster;
import javax.management.NotificationBroadcasterSupport;
import javax.management.NotificationFilter;
import javax.management.NotificationListener;

@Default
@ApplicationScoped
public class ShotCounter implements ShotCounterMXBean, NotificationBroadcaster{
    
    private final NotificationBroadcasterSupport broadcaster = 
            new NotificationBroadcasterSupport();
    
    @Inject
    private JMXRegistrationBean jmxReg;
    
    @Inject
    private HitProcessor hitProcessor;
    
    int total_cnt = 0;
    int hit_cnt = 0;
    
    long sequenceNumber = 0L;
    
    public void init(@Observes @Initialized(ApplicationScoped.class) Object pointless) {
        jmxReg.add(this, "ShotCounter");
    }
    
    @PreDestroy
    public void destroy() {
        jmxReg.remove(this);
    }
    
    public void registerShot(Shot shot) {
        total_cnt++;
        if(shot.isShot()) {
            hit_cnt++;
        }
        if(!hitProcessor.insideBox(shot)) {
            broadcaster.sendNotification(new Notification(
                    "OutOfBoxNotification", this, sequenceNumber++, "Shot is out of box"
            ));
        }
    }

    @Override
    public int getShotCount() {
        return total_cnt;
    }

    @Override
    public int getHitCount() {
        return hit_cnt;
    }

    @Override
    public void addNotificationListener(NotificationListener listener, NotificationFilter filter, Object handback) throws IllegalArgumentException {
        broadcaster.addNotificationListener(listener, filter, handback);
    }

    @Override
    public void removeNotificationListener(NotificationListener listener) throws ListenerNotFoundException {
        broadcaster.removeNotificationListener(listener);
    }

    @Override
    public MBeanNotificationInfo[] getNotificationInfo() {
        return new MBeanNotificationInfo[]{ 
            new MBeanNotificationInfo(
                    new String[]{"OutOfBoxNotification"}, 
                    Notification.class.getName(), 
                    "Out of box notifications"
            )
        };
    }
    
}
