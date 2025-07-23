package com.example.backend.services.Impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.entity.Board;
import com.example.backend.entity.Group;
import com.example.backend.repository.BoardRepository;
import com.example.backend.repository.GroupRepository;
import com.example.backend.services.GroupService;
import com.example.backend.dto.GroupDTO;

@Service
public class GroupServiceImpl implements GroupService {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private BoardRepository boardRepository;

    @Override
    public List<GroupDTO> getAllGroups() {
        return groupRepository.findAll().stream()
                .map(group -> new GroupDTO(
                        group.getId(),
                        group.getName(),
                        group.getBoard() != null ? group.getBoard().getId() : null))
                .toList();
    }

    @Override
    public GroupDTO createGroup(GroupDTO groupDTO) {
        Group group = new Group();
        group.setName(groupDTO.getName());

        // Lấy đối tượng Board từ boardId nếu có
        if (groupDTO.getBoardId() != null) {
            Board board = boardRepository.findById(groupDTO.getBoardId())
                    .orElseThrow(() -> new RuntimeException("Board not found with id: " + groupDTO.getBoardId()));
            group.setBoard(board); // Gán board vào group (khóa ngoại)
        }

        Group saved = groupRepository.save(group);

        return new GroupDTO(
                saved.getId(),
                saved.getName(),
                saved.getBoard() != null ? saved.getBoard().getId() : null);
    }

    @Override
    public GroupDTO updateGroup(Long id, GroupDTO groupDTO) {
        Group group = groupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        group.setName(groupDTO.getName());

        Group updated = groupRepository.save(group);
        return new GroupDTO(updated.getId(), updated.getName(),
                updated.getBoard() != null ? updated.getBoard().getId() : null);
    }

    @Override
    public void deleteGroup(Long id) {
        groupRepository.deleteById(id);
    }

}