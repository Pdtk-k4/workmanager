// package com.example.backend.services.Impl;

// import com.example.backend.dto.UserDTO;
// import com.example.backend.entity.Role;
// import com.example.backend.entity.User;
// import com.example.backend.entity.UserRole;
// import com.example.backend.repository.RoleRepository;
// import com.example.backend.repository.UserRepository;
// import com.example.backend.services.UserService;

// import java.util.HashSet;
// import java.util.List;
// import java.util.Set;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.stereotype.Service;

// @Service
// public class UserServiceImpl implements UserService {
//     private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

//     @Autowired
//     private UserRepository userRepository;

//     @Autowired
//     private RoleRepository roleRepository;

//     @Autowired
//     private BCryptPasswordEncoder passwordEncoder;

//     @Override
//     public UserDTO login(String name, String password) {
//         if (name == null || password == null) {
//             logger.warn("Login failed: Name or password is null");
//             return null;
//         }
//         List<User> user = userRepository.findByName(name);
//         if (user.isEmpty()) {
//             logger.warn("Login failed: User not found for name: {}", name);
//             return null;
//         }
//         User users = user.get(0);
//         if (!passwordEncoder.matches(password, users.getPasswordHash())) {
//             logger.warn("Login failed: Incorrect password for user: {}", name);
//             return null;
//         }
//         logger.info("Login successful for user: {}", name);
//         return new UserDTO(users.getId(), users.getName(), users.getEmail(), users.getAvatarUrl());
//     }

//     @Override
//     public UserDTO register(UserDTO userDTO) {
//         logger.info("Registering user: {}", userDTO.getEmail());

//         // Kiểm tra đầu vào
//         if (userDTO.getName() == null || userDTO.getName().trim().isEmpty()) {
//             logger.warn("Registration failed: Name is empty");
//             return null;
//         }
//         if (userDTO.getEmail() == null || userDTO.getEmail().trim().isEmpty()) {
//             logger.warn("Registration failed: Email is empty");
//             return null;
//         }
//         if (userDTO.getPassword() == null || userDTO.getPassword().trim().isEmpty()) {
//             logger.warn("Registration failed: Password is empty");
//             return null;
//         }

//         // Kiểm tra email và name đã tồn tại
//         List<User> existingUsersByEmail = userRepository.findByEmail(userDTO.getEmail());
//         if (!existingUsersByEmail.isEmpty()) {
//             logger.warn("Registration failed: Email already exists: {}", userDTO.getEmail());
//             return null;
//         }
//         List<User> existingUsersByName = userRepository.findByName(userDTO.getName());
//         if (!existingUsersByName.isEmpty()) {
//             logger.warn("Registration failed: Name already exists: {}", userDTO.getName());
//             return null;
//         }

//         // Tìm hoặc tạo role USER
//         Role userRole = roleRepository.findByName("USER");
//         if (userRole == null) {
//             logger.info("Creating new role: USER");
//             try {
//                 userRole = new Role();
//                 userRole.setName("USER");
//                 userRole = roleRepository.save(userRole);
//                 logger.info("Role USER created with ID: {}", userRole.getId());
//             } catch (Exception e) {
//                 logger.error("Failed to create role USER: {}", e.getMessage());
//                 return null;
//             }
//         }

//         // Tạo user mới
//         User user = new User();
//         user.setName(userDTO.getName().trim());
//         user.setEmail(userDTO.getEmail().trim());
//         user.setPasswordHash(passwordEncoder.encode(userDTO.getPassword()));

//         // Gán role USER
//         UserRole userRoleEntity = new UserRole();
//         userRoleEntity.setUser(user);
//         userRoleEntity.setRole(userRole);

//         Set<UserRole> userRoles = new HashSet<>();
//         userRoles.add(userRoleEntity);
//         user.setUserRoles(userRoles);

//         // Lưu user
//         try {
//             User saved = userRepository.saveAndFlush(user);
//             logger.info("User registered successfully: {}", saved.getEmail());
//             return new UserDTO(saved.getId(), saved.getName(), saved.getEmail(), saved.getAvatarUrl());
//         } catch (Exception e) {
//             logger.error("Failed to register user: {}", e.getMessage());
//             return null;
//         }
//     }

//     @Override
//     public UserDTO getUserById(Long id) {
//         logger.info("Fetching user by ID: {}", id);
//         return userRepository.findById(id)
//                 .map(user -> {
//                     logger.info("User found: {}", user.getEmail());
//                     return new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getAvatarUrl());
//                 })
//                 .orElseGet(() -> {
//                     logger.warn("User not found for ID: {}", id);
//                     return null;
//                 });
//     }

//     @Override
//     public UserDTO updateProfile(Long id, UserDTO userDTO) {
//         logger.info("Updating profile for user ID: {}", id);
//         User user = userRepository.findById(id).orElse(null);
//         if (user == null) {
//             logger.warn("User not found for ID: {}", id);
//             return null;
//         }
//         user.setAvatarUrl(userDTO.getAvatarUrl());
//         try {
//             User saved = userRepository.save(user);
//             logger.info("Profile updated for user: {}", saved.getEmail());
//             return new UserDTO(saved.getId(), saved.getName(), saved.getEmail(), saved.getAvatarUrl());
//         } catch (Exception e) {
//             logger.error("Failed to update profile: {}", e.getMessage());
//             return null;
//         }
//     }
// }

package com.example.backend.services.Impl;

import com.example.backend.dto.RoleDTO;
import com.example.backend.dto.UserDTO;
import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.entity.UserRole;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.services.UserService;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public UserDTO login(String name, String password) {
        if (name == null || password == null) {
            logger.warn("Login failed: Name or password is null");
            return null;
        }
        List<User> user = userRepository.findByName(name);
        if (user.isEmpty()) {
            logger.warn("Login failed: User not found for name: {}", name);
            return null;
        }
        User users = user.get(0);
        if (!passwordEncoder.matches(password, users.getPasswordHash())) {
            logger.warn("Login failed: Incorrect password for user: {}", name);
            return null;
        }
        logger.info("Login successful for user: {}", name);

        Set<RoleDTO> roles = users.getUserRoles().stream()
                .map(userRole -> new RoleDTO(userRole.getRole().getName()))
                .collect(Collectors.toSet());
        return new UserDTO(users.getId(), users.getName(), users.getEmail(), users.getAvatarUrl(), roles);
    }

    @Override
    public UserDTO register(UserDTO userDTO) {
        logger.info("Registering user: {}", userDTO.getEmail());

        if (userDTO.getName() == null || userDTO.getName().trim().isEmpty()) {
            logger.warn("Registration failed: Name is empty");
            return null;
        }
        if (userDTO.getEmail() == null || userDTO.getEmail().trim().isEmpty()) {
            logger.warn("Registration failed: Email is empty");
            return null;
        }
        if (userDTO.getPassword() == null || userDTO.getPassword().trim().isEmpty()) {
            logger.warn("Registration failed: Password is empty");
            return null;
        }

        List<User> existingUsersByEmail = userRepository.findByEmail(userDTO.getEmail());
        if (!existingUsersByEmail.isEmpty()) {
            logger.warn("Registration failed: Email already exists: {}", userDTO.getEmail());
            return null;
        }
        List<User> existingUsersByName = userRepository.findByName(userDTO.getName());
        if (!existingUsersByName.isEmpty()) {
            logger.warn("Registration failed: Name already exists: {}", userDTO.getName());
            return null;
        }

        // Tìm hoặc tạo role USER
        Role userRole = roleRepository.findByName("USER");
        if (userRole == null) {
            logger.info("Creating new role: USER");
            try {
                userRole = new Role();
                userRole.setName("USER");
                userRole = roleRepository.save(userRole);
                logger.info("Role USER created with ID: {}", userRole.getId());
            } catch (Exception e) {
                logger.error("Failed to create role USER: {}", e.getMessage());
                return null;
            }
        }

        // Tạo user mới
        User user = new User();
        user.setName(userDTO.getName().trim());
        user.setEmail(userDTO.getEmail().trim());
        user.setPasswordHash(passwordEncoder.encode(userDTO.getPassword()));

        // Gán role USER
        UserRole userRoleEntity = new UserRole();
        userRoleEntity.setUser(user);
        userRoleEntity.setRole(userRole);

        Set<UserRole> userRoles = new HashSet<>();
        userRoles.add(userRoleEntity);
        user.setUserRoles(userRoles);

        // Lưu user
        try {
            User saved = userRepository.saveAndFlush(user);
            logger.info("User registered successfully: {}", saved.getEmail());
            return new UserDTO(saved.getId(), saved.getName(), saved.getEmail(), saved.getAvatarUrl());
        } catch (Exception e) {
            logger.error("Failed to register user: {}", e.getMessage());
            return null;
        }
    }

    @Override
    public UserDTO getUserById(Long id) {
        logger.info("Fetching user by ID: {}", id);
        return userRepository.findById(id)
                .map(user -> {
                    logger.info("User found: {}", user.getEmail());
                    // Chuyển đổi roles thành Set<RoleDTO>
                    Set<RoleDTO> roles = user.getUserRoles().stream()
                            .map(userRole -> new RoleDTO(userRole.getRole().getName()))
                            .collect(Collectors.toSet());
                    return new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getAvatarUrl(), roles);
                })
                .orElseGet(() -> {
                    logger.warn("User not found for ID: {}", id);
                    return null;
                });
    }

    @Override
    public UserDTO updateProfile(Long id, UserDTO userDTO) {
        logger.info("Updating profile for user ID: {}", id);
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            logger.warn("User not found for ID: {}", id);
            return null;
        }
        user.setAvatarUrl(userDTO.getAvatarUrl());
        try {
            User saved = userRepository.save(user);
            logger.info("Profile updated for user: {}", saved.getEmail());
            // Chuyển đổi roles thành Set<RoleDTO>
            Set<RoleDTO> roles = saved.getUserRoles().stream()
                    .map(userRole -> new RoleDTO(userRole.getRole().getName()))
                    .collect(Collectors.toSet());
            return new UserDTO(saved.getId(), saved.getName(), saved.getEmail(), saved.getAvatarUrl(), roles);
        } catch (Exception e) {
            logger.error("Failed to update profile: {}", e.getMessage());
            return null;
        }
    }
}