/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ListDo;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Mad
 */
@Service
public class ListDoService {
    
    private final ListDoRepository listRepository;
    
    @Autowired
    public ListDoService(ListDoRepository listRepository) {
        this.listRepository = listRepository;
    }
    
    public List<ListDo> getListTask() {
        return listRepository.findAll();
    }
    
    public ListDo addNewTask(ListDo lst) {
        return listRepository.save(lst);
    }
    
    public ListDo editTask(ListDo lst) {
        return listRepository.save(lst);
    }
    
    public boolean delTask(Long id) {
        Optional<ListDo> task = listRepository.findById(id);
        if (task.isEmpty()) {
            return false;
        }
        listRepository.delete(task.get());
        return true;
        
    }
    
}
