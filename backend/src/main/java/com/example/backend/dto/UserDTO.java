// package com.example.backend.dto;

// import java.util.Set;

// public class UserDTO {
//     private Long id;
//     private String name;
//     private String email;
//     private String avatarUrl;
//     private String password;

//     public UserDTO() {
//     }

//     public UserDTO(Long id, String name, String email) {
//         this.id = id;
//         this.name = name;
//         this.email = email;
//     }

//     public UserDTO(Long id, String name, String email, String avatarUrl) {
//         this.id = id;
//         this.name = name;
//         this.email = email;
//         this.avatarUrl = avatarUrl;
//     }

//     public UserDTO(Long id, String name, String email, String avatarUrl, String password) {
//         this.id = id;
//         this.name = name;
//         this.email = email;
//         this.avatarUrl = avatarUrl;
//         this.password = password;
//     }

//     public Long getId() {
//         return id;
//     }

//     public void setId(Long id) {
//         this.id = id;
//     }

//     public String getName() {
//         return name;
//     }

//     public void setName(String name) {
//         this.name = name;
//     }

//     public String getEmail() {
//         return email;
//     }

//     public void setEmail(String email) {
//         this.email = email;
//     }

//     public String getAvatarUrl() {
//         return avatarUrl;
//     }

//     public void setAvatarUrl(String avatarUrl) {
//         this.avatarUrl = avatarUrl;
//     }

//     public String getPassword() {
//         return password;
//     }

//     public void setPassword(String password) {
//         this.password = password;
//     }
// }

package com.example.backend.dto;

import java.util.Set;

public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String avatarUrl;
    private String password;
    private Set<RoleDTO> roles; // Thêm trường roles

    public UserDTO() {
    }

    public UserDTO(Long id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    public UserDTO(Long id, String name, String email, String avatarUrl) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.avatarUrl = avatarUrl;
    }

    public UserDTO(Long id, String name, String email, String avatarUrl, String password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.avatarUrl = avatarUrl;
        this.password = password;
    }

    public UserDTO(Long id, String name, String email, String avatarUrl, Set<RoleDTO> roles) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.avatarUrl = avatarUrl;
        this.roles = roles;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<RoleDTO> getRoles() {
        return roles;
    }

    public void setRoles(Set<RoleDTO> roles) {
        this.roles = roles;
    }
}