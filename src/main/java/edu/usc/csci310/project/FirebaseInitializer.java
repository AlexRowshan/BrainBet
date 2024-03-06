package edu.usc.csci310.project;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;

//the FirebaseInitializer class configures and initializes Firebase using service account credentials, ensuring that Firebase services are available for use throughout the Spring Boot application.
@Service
public class FirebaseInitializer {

    private FileInputStream serviceAccount;
    private FirebaseOptions options;

    @PostConstruct
    public void initialize() {
        try {
            serviceAccount = new FileInputStream("src/main/resources/serviceAccountKey.json");
            options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            FirebaseApp.initializeApp(options);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
