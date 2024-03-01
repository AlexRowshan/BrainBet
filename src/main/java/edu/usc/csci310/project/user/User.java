package edu.usc.csci310.project.user;

public class User {
    private String username;
    private String password;
    private int currency;

    public User(String username, String password){
        this.username = username;
        this.password = password;
        this.currency = 100;
    }
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getCurrency() {
        return currency;
    }

    public void setCurrency(int currency) {
        this.currency = currency;
    }
}
