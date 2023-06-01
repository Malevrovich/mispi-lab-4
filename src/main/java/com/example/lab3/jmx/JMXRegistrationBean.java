package com.example.lab3.jmx;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Named;
import java.lang.management.ManagementFactory;
import java.util.HashMap;
import java.util.Map;
import javax.management.InstanceAlreadyExistsException;
import javax.management.InstanceNotFoundException;
import javax.management.MBeanRegistrationException;
import javax.management.MalformedObjectNameException;
import javax.management.NotCompliantMBeanException;
import javax.management.ObjectName;

@Named
@ApplicationScoped
public class JMXRegistrationBean {

    private Map<Class<?>, ObjectName> classToName = new HashMap();

    static ObjectName getName(Object mbean, String tag) {
        try {
            return new ObjectName(mbean.getClass().getPackageName(),
                    mbean.getClass().getSimpleName(),
                    tag);
        } catch (MalformedObjectNameException ex) {
            return null;
        }
    }

    void add(Object mbean, String tag) {
        try {
            ObjectName name = getName(mbean, tag);
            classToName.put(mbean.getClass(), name);
            ManagementFactory.getPlatformMBeanServer().registerMBean(mbean, name);
        } catch (InstanceAlreadyExistsException | MBeanRegistrationException | NotCompliantMBeanException ex) {
        }
    }

    void remove(Object mbean) {
        try {
            ManagementFactory.getPlatformMBeanServer()
                    .unregisterMBean(classToName.get(mbean.getClass()));
        } catch (InstanceNotFoundException | MBeanRegistrationException ex) {
        }
    }
}
