package edu.usc.csci310.project.configuration;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;

@Configuration
public class FirestoreConfig {

    @Bean
    @DependsOn("firebaseInitializer")
    public Firestore firestore() {
        return FirestoreClient.getFirestore();
    }
}