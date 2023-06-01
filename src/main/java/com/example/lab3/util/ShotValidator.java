package com.example.lab3.util;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Named;

@Named("ShotValidator")
@ApplicationScoped
public class ShotValidator {
    private String message = "";
    private Boolean valid = true;

    public void validateParameters(String x, String y, String r) {
        try {
            float x_val = Float.parseFloat(x);
            if(x_val < -5 || x_val > 5) {
                message = "X must be in range of [-5;5]";
                valid = false;
                return;
            }

            float y_val = Float.parseFloat(y);
            if(y_val < -5 || y_val > 5) {
                message = "Y must be in range [-5;5]";
                valid = false;
                return;
            }

            float r_val = Float.parseFloat(r);
            if(r_val < 0 || r_val > 5) {
                message = "R must be in range [0;5]";
                valid = false;
            }
        } catch (NumberFormatException exception) {
            message = "X, Y, R must be float";
            valid = false;
        } catch (NullPointerException exception) {
            message = "Please add X, Y and R";
            valid = false;
        }
        valid = true;
    }

    public String getMessage() {
        return message;
    }

    public Boolean getValid() {
        return valid;
    }
}
