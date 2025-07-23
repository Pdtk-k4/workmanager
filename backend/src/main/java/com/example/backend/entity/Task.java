package com.example.backend.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.time.LocalDate;

@Entity
@Table(name = "tbl_tasks")
public class Task {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @ManyToOne
    @JoinColumn(name = "group_id", referencedColumnName = "id")
    @JsonBackReference(value = "group-task")
    private Group group;

    @Column(name = "status")
    private int status;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "timeline_start")
    private LocalDate timelineStart;

    @Column(name = "timeline_end")
    private LocalDate timelineEnd;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    public Task() {
    }

    public Task(Long id, String name, Group group, int status, LocalDate dueDate, LocalDate timelineStart,
            LocalDate timelineEnd, String notes) {
        this.id = id;
        this.name = name;
        this.group = group;
        this.status = status;
        this.dueDate = dueDate;
        this.timelineStart = timelineStart;
        this.timelineEnd = timelineEnd;
        this.notes = notes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public Group getGroup() {
        return group;
    }

    public void setGroup(Group group) {
        this.group = group;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDate getTimelineStart() {
        return timelineStart;
    }

    public void setTimelineStart(LocalDate timelineStart) {
        this.timelineStart = timelineStart;
    }

    public LocalDate getTimelineEnd() {
        return timelineEnd;
    }

    public void setTimelineEnd(LocalDate timelineEnd) {
        this.timelineEnd = timelineEnd;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

}
