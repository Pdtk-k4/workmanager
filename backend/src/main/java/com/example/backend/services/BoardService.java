package com.example.backend.services;

import com.example.backend.dto.BoardDTO;
import java.util.List;
import java.util.Optional;

public interface BoardService {
    List<BoardDTO> getAllBoards();

    Optional<BoardDTO> getBoardById(Long id);

    BoardDTO createBoard(BoardDTO boardDTO);

    BoardDTO updateBoard(Long id, BoardDTO boardDTO);

    void deleteBoard(Long id);
}
