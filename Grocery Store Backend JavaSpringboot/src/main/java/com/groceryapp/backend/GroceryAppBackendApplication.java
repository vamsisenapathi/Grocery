package com.groceryapp.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableJpaRepositories
@EnableTransactionManagement
public class GroceryAppBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(GroceryAppBackendApplication.class, args);
    }
}