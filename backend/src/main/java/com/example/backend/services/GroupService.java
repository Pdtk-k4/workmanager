package com.example.backend.services;

import java.util.List;

import com.example.backend.dto.GroupDTO;

public interface GroupService {

    List<GroupDTO> getAllGroups();

    GroupDTO createGroup(GroupDTO groupDTO);

    GroupDTO updateGroup(Long id, GroupDTO groupDTO);

    void deleteGroup(Long id);
}