package com.example.backend.dto;

import java.time.LocalDate;

public class TaskDTO {
    private Long id;
    private String name;
    private int status;
    private LocalDate dueDate;
    private LocalDate timelineStart;
    private LocalDate timelineEnd;
    private String notes;
    private Long groupId;

    public TaskDTO() {
    }

    public TaskDTO(Long id, String name, int status, LocalDate dueDate, LocalDate timelineStart, LocalDate timelineEnd,
            String notes, Long groupId) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.dueDate = dueDate;
        this.timelineStart = timelineStart;
        this.timelineEnd = timelineEnd;
        this.notes = notes;
        this.groupId = groupId;
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

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }
}
