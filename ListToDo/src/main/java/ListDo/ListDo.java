/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ListDo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

/**
 *
 * @author Mad
 */
@Entity
@Table
public class ListDo {

    @Id
    @GeneratedValue
    private Long id;
    private String task;
    private Boolean isDone;
    private LocalDate mustDone;

    public ListDo(Long id, String task, Boolean isDone, LocalDate mustDone) {
        this.id = id;
        this.task = task;
        this.isDone = isDone;
        this.mustDone = mustDone;
    }

    public ListDo(String task, Boolean isDone, LocalDate mustDone) {
        this.task = task;
        this.isDone = isDone;
        this.mustDone = mustDone;
    }

    public ListDo() {

    }

    public LocalDate getMustDone() {
        return this.mustDone;
    }

    public void setMustDone(LocalDate mustDone) {
        this.mustDone = mustDone;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTask() {
        return task;
    }

    public void setTask(String task) {
        this.task = task;
    }

    public Boolean getIsDone() {
        return isDone;
    }

    public void setIsDone(Boolean isDone) {
        this.isDone = isDone;
    }

    @Override
    public String toString() {
        return "ListDo{" + "id=" + id + ", task=" + task + ", isDone=" + isDone + ", mustDone=" + mustDone + '}';
    }

}
