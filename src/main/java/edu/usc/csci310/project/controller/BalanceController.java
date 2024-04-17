package edu.usc.csci310.project.controller;

import edu.usc.csci310.project.user.User;
import edu.usc.csci310.project.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BalanceController {
    private final UserService userService;
    @Autowired
    public BalanceController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/balance")
    public ResponseEntity<Float> getBalance(@RequestBody UserRequest request) {
        try {
            float balance = userService.getWagerAmount(request.getUsername());
            System.out.println("This is the balance");
            System.out.println(balance);
            return ResponseEntity.ok(balance);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build(); // Handle specific cases as needed
        }
    }

    static class UserRequest {
        private String username;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }
    }
}
