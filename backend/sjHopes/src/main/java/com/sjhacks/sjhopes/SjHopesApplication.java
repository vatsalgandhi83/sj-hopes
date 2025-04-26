package com.sjhacks.sjhopes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SjHopesApplication {

    public static void main(String[] args) {
        SpringApplication.run(SjHopesApplication.class, args);
        System.out.println("\nSJ Hopes Application Started!");
        // Updated DB name in JDBC URL
        System.out.println("Access H2 Console at: http://localhost:8081/h2-console (JDBC URL: jdbc:h2:mem:sjhopes)");
        System.out.println("API Base URL: http://localhost:8081/api\n");
    }

}
