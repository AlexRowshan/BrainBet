package edu.usc.csci310.project.controller;
import edu.usc.csci310.project.user.User;
import edu.usc.csci310.project.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.ExecutionException;

@RestController
public class UserController {
    private final UserService userService;
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) throws ExecutionException, InterruptedException {
        boolean result = false;
        try{
            result = userService.signIn(user.getUsername(), user.getPassword());
        }
        catch(Exception e){
            return e.getMessage();
        }
        if(result){
            return "success";
        }
        return "fail";
    }

    @PostMapping("/signup")
    public String registerUser(@RequestBody User user){
        try{
            String doc = userService.createUser(user.getUsername(), user.getPassword());
        }
        catch (Exception e){
            return e.getMessage();
        }
        //Todo: Put inside the try?
        return "success";
    }


}
