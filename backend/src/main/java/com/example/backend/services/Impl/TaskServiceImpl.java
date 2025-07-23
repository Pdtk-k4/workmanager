package com.example.backend.services.Impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.entity.Task;
import com.example.backend.repository.TaskRepository;
import com.example.backend.services.TaskService;
import com.example.backend.dto.TaskDTO;

@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Override
    public List<TaskDTO> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(task -> new TaskDTO(
                        task.getId(),
                        task.getName(),
                        task.getStatus(),
                        task.getDueDate(),
                        task.getTimelineStart(),
                        task.getTimelineEnd(),
                        task.getNotes(),
                        task.getGroup() != null ? task.getGroup().getId() : null))
                .toList();
    }

    @Override
    public Optional<TaskDTO> getTaskById(Long id) {
        return taskRepository.findById(id)
                .map(task -> new TaskDTO(
                        task.getId(),
                        task.getName(),
                        task.getStatus(),
                        task.getDueDate(),
                        task.getTimelineStart(),
                        task.getTimelineEnd(),
                        task.getNotes(),
                        task.getGroup() != null ? task.getGroup().getId() : null));
    }

    @Override
    public TaskDTO createTask(TaskDTO taskDTO) {
        Task task = new Task();
        task.setName(taskDTO.getName());
        task.setStatus(taskDTO.getStatus());
        task.setDueDate(taskDTO.getDueDate());
        task.setTimelineStart(taskDTO.getTimelineStart());
        task.setTimelineEnd(taskDTO.getTimelineEnd());
        task.setNotes(taskDTO.getNotes());

        Task saved = taskRepository.save(task);
        return new TaskDTO(saved.getId(), saved.getName(), saved.getStatus(), saved.getDueDate(),
                saved.getTimelineStart(), saved.getTimelineEnd(), saved.getNotes(),
                saved.getGroup() != null ? saved.getGroup().getId() : null);
    }

    @Override
    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setName(taskDTO.getName());
        task.setStatus(taskDTO.getStatus());
        task.setDueDate(taskDTO.getDueDate());
        task.setTimelineStart(taskDTO.getTimelineStart());
        task.setTimelineEnd(taskDTO.getTimelineEnd());
        task.setNotes(taskDTO.getNotes());

        Task updated = taskRepository.save(task);
        return new TaskDTO(updated.getId(), updated.getName(), updated.getStatus(), updated.getDueDate(),
                updated.getTimelineStart(), updated.getTimelineEnd(), updated.getNotes(),
                updated.getGroup() != null ? updated.getGroup().getId() : null);
    }

    @Override
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}