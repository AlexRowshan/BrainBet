//package edu.usc.csci310.project.controller;
//
//import com.google.api.core.ApiFuture;
//import com.google.cloud.firestore.*;
//import com.google.firebase.cloud.FirestoreClient;
//import org.springframework.stereotype.Service;
//
//import java.util.*;
//import java.util.concurrent.ExecutionException;
//@Service
//public class GameManager {
//    private final Firestore db;
//
//    public GameManager(){
//        this.db = FirestoreClient.getFirestore();
//    }
//
//    public String createGameSession(String creatorUsername) {
//        String gameCode = generate6DigitCode();
//        Map<String, Object> gameSession = new HashMap<>();
//        gameSession.put("gameId", gameCode);
//        gameSession.put("creatorUsername", creatorUsername);
//        gameSession.put("participants", Arrays.asList(creatorUsername));
//
//        db.collection("gameSessions").add(gameSession);
//        return gameCode;
//    }
//    private String generate6DigitCode() {
//        Random random = new Random();
//        int number = random.nextInt(900000) + 100000; // This generates a number in the range 100000 (inclusive) to 1000000 (exclusive)
//        return String.valueOf(number);
//    }
//    public boolean joinGameSession(String gameCode, String playerName) throws ExecutionException, InterruptedException {
//        CollectionReference sessions = db.collection("gameSessions");
//        ApiFuture<QuerySnapshot> future = sessions.whereEqualTo("gameCode", gameCode).get();
//        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
//        if(!documents.isEmpty()){
//            DocumentReference sessionRef = documents.get(0).getReference();
//            sessionRef.update("participants",FieldValue.arrayUnion(playerName)).get();
//            return true;
//        }
//        return false;
//    }
//
//}
