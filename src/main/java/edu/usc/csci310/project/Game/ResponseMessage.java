package edu.usc.csci310.project.Game;
public class ResponseMessage {
    private boolean success;
    private String gameCode;

    public ResponseMessage(boolean success, String gameCode) {
        this.success = success;
        this.gameCode = gameCode;
    }


}