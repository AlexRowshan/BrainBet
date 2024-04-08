package edu.usc.csci310.project.Game;

import java.util.ArrayList;
import java.util.List;

public class TriviaQuestion {
    private String question;
    private List<String> options = new ArrayList<>();
    private String correctAnswer;


    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }
}
