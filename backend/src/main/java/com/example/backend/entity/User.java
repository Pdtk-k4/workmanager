package com.example.backend.entity;

import java.util.Set;

import jakarta.persistence.*;

@Entity
@Table(name = "tbl_users")
public class User {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "password_hash")
    private String password_hash;

    @Column(name = "avatar_url")
    private String avatar_url;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserRole> userRoles;

    public User() {
    }

    public User(Long id, String name, String email, String password_hash, String avatar_url, Set<UserRole> userRoles) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password_hash = password_hash;
        this.avatar_url = avatar_url;
        this.userRoles = userRoles;

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

    public String getPasswordHash() {
        return password_hash;
    }

    public void setPasswordHash(String password_hash) {
        this.password_hash = password_hash;
    }

    public String getAvatarUrl() {
        return avatar_url;
    }

    public void setAvatarUrl(String avatar_url) {
        this.avatar_url = avatar_url;
    }

    public Set<UserRole> getUserRoles() {
        return userRoles;
    }

    public void setUserRoles(Set<UserRole> userRoles) {
        this.userRoles = userRoles;
    }
}
