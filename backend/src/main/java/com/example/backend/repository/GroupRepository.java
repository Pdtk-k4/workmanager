package com.example.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.entity.Group;

public interface GroupRepository extends JpaRepository<Group, Long> {
    List<Group> findByBoardId(Long boardId);
}
