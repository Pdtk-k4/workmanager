
package com.example.backend.services.Impl;

import com.example.backend.dto.BoardDTO;
import com.example.backend.entity.Board;
import com.example.backend.repository.BoardRepository;
import com.example.backend.services.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class BoardServiceImpl implements BoardService {

    @Autowired
    private BoardRepository boardRepository;

    @Override
    public List<BoardDTO> getAllBoards() {
        return boardRepository.findAll().stream()
                .map(board -> new BoardDTO(board.getId(), board.getName(), board.getDescription()))
                .toList();
    }

    @Override
    public Optional<BoardDTO> getBoardById(Long id) {
        return boardRepository.findById(id)
                .map(board -> new BoardDTO(board.getId(), board.getName(), board.getDescription()));
    }

    @Override
    public BoardDTO createBoard(BoardDTO boardDTO) {
        Board board = new Board();
        board.setName(boardDTO.getName());
        board.setDescription(boardDTO.getDescription());
        Board saved = boardRepository.save(board);
        return new BoardDTO(saved.getId(), saved.getName(), saved.getDescription());
    }

    @Override
    public BoardDTO updateBoard(Long id, BoardDTO boardDTO) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Board not found"));
        board.setName(boardDTO.getName());
        board.setDescription(boardDTO.getDescription());
        Board updated = boardRepository.save(board);
        return new BoardDTO(updated.getId(), updated.getName(), updated.getDescription());
    }

    @Override
    public void deleteBoard(Long id) {
        boardRepository.deleteById(id);
    }
}
