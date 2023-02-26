/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ListDo;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Mad
 */
@RestController
@RequestMapping(path="/ListDo")
public class ListDoController {
    private final ListDoService listService;
    
    @Autowired
    public ListDoController(ListDoService listService){
        this.listService = listService;
    }
    
    @GetMapping
    public List<ListDo>getListDo(){
        return listService.getListTask();
    }
    @PostMapping(value="/EditTask")
    public ListDo editTask(@RequestBody ListDo lst){
        return listService.editTask(lst);
    }
    @PostMapping(value="/AddTask")
    public ListDo addNewTask(@RequestBody ListDo lst){
        return listService.addNewTask(lst);
    }
    @PostMapping(value="/DelTask")
    public boolean delTask(@RequestBody Long id){
       return listService.delTask(id);
    }
}
