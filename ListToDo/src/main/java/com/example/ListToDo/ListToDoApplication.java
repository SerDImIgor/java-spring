package com.example.ListToDo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//https://www.youtube.com/watch?v=9SGDpanrc8U

@SpringBootApplication(scanBasePackages = {
    "ListDo"
})
@ComponentScan({"ListDo"})
@EntityScan("ListDo")
@EnableJpaRepositories("ListDo")
public class ListToDoApplication {

    public static void main(String[] args) {
        SpringApplication.run(ListToDoApplication.class, args);
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**").allowedOrigins("*").allowedMethods("GET", "POST", "PUT", "DELETE");
            }
        };
    }
}
