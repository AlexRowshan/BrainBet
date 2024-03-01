package edu.usc.csci310.project.user;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.auth.hash.Bcrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.concurrent.ExecutionException;

@Service
public class UserService {
    private final Firestore firestore;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(Firestore firestore){
        this.firestore = firestore;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public String createUser(String username, String password)throws ExecutionException, InterruptedException{
        //holds a reference to a firestore collection like a link
        CollectionReference users = firestore.collection("users");
        //include all documents that meet the query criteria
        ApiFuture<QuerySnapshot> querySnapshot = users.whereEqualTo("username", username).get();
        if(!querySnapshot.get().getDocuments().isEmpty()){
            throw new IllegalStateException("Username already exists");
        }
        User user = new User(username, passwordEncoder.encode(password));
        //adding it to the firebase and it will return an apifuture object that points to the newly added document in firestore
        ApiFuture<DocumentReference> addedDocRef = users.add(user);
        return addedDocRef.get().getId();
    }
}
