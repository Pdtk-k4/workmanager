package com.example.backend.services;

import com.example.backend.dto.UserDTO;

public interface UserService {
    UserDTO login(String name, String password);

    UserDTO register(UserDTO userDTO);

    UserDTO getUserById(Long id);

    UserDTO updateProfile(Long id, UserDTO userDTO);
}
