/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ListDo;

import java.time.LocalDate;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 *
 * @author Mad
 */
@Configuration
public class ListDoConf {
    @Bean
    CommandLineRunner commandLineRunner(ListDoRepository listDoRepository) {
        return args -> {
          ListDo ts1 = new ListDo("Sleep",true,LocalDate.of(2000,6, 10));
          ListDo ts2 = new ListDo("Work",false,LocalDate.of(2000,6, 10));
          listDoRepository.saveAll(List.of(ts1,ts2));
        };
    }

}
