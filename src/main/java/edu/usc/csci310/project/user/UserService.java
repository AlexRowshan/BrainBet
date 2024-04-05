package edu.usc.csci310.project.user;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
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
        //return a query snapshot that contains document objects that meet the query criteria
        ApiFuture<QuerySnapshot> querySnapshot = users.whereEqualTo("username", username).get();
        if(!querySnapshot.get().getDocuments().isEmpty()){
            throw new IllegalStateException("Username already exists");
        }
        User user = new User(username, passwordEncoder.encode(password));
        //adding it to the firebase and it will return an apifuture object that points to the newly added document in firestore
        ApiFuture<DocumentReference> addedDocRef = users.add(user);
        return addedDocRef.get().getId();
    }

    public boolean signIn(String username, String password) throws ExecutionException, InterruptedException{
        CollectionReference users = firestore.collection("users");
        ApiFuture<QuerySnapshot> querySnapshot = users.whereEqualTo("username", username).get();
        //Each DocumentSnapshot represents a single document from the Firestore database that matched the query
        List<QueryDocumentSnapshot> documents = querySnapshot.get().getDocuments();
        if(documents.isEmpty()){
            throw new IllegalStateException("User does not exist");
        }
        User user = documents.get(0).toObject(User.class);
        return passwordEncoder.matches(password, user.getPassword());
    }


}
