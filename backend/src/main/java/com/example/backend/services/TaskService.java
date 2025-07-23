package com.example.backend.services;

import java.util.List;
import java.util.Optional;
import com.example.backend.dto.TaskDTO;

public interface TaskService {
    List<TaskDTO> getAllTasks();

    Optional<TaskDTO> getTaskById(Long id);

    TaskDTO createTask(TaskDTO taskDTO);

    TaskDTO updateTask(Long id, TaskDTO taskDTO);

    void deleteTask(Long id);
}
