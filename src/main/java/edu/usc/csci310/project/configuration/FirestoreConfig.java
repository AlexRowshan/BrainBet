package edu.usc.csci310.project.configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.io.IOException;

@Configuration
public class FirestoreConfig {
    @Bean
    public Firestore firestore() throws IOException {
        String firebaseConfig = System.getenv("FIREBASE_CONFIG");
        if (firebaseConfig != null && !firebaseConfig.isEmpty()) {
            // Convert the environment variable content to InputStream
            ByteArrayInputStream serviceAccount = new ByteArrayInputStream(firebaseConfig.getBytes());

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            // Initialize the app if it hasn't been initialized yet
            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }

            return FirestoreClient.getFirestore();
        }
        throw new IllegalStateException("Firebase configuration not found. Please set FIREBASE_CONFIG environment variable.");
    }
}