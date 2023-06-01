package com.example.lab3.util;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Named;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Named("Time")
@ApplicationScoped
public class TimeBean {
    public String getCurrentTime() {
        return LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
    }
}
