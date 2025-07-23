package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.Board;

public interface BoardRepository extends JpaRepository<Board, Long> {
    // Additional query methods can be defined here if needed
}