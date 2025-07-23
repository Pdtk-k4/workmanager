package com.example.backend.entity;

import java.util.Set;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

@Entity
@Table(name = "tbl_boards")
public class Board {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "board")
    @JsonManagedReference(value = "board-group")
    private Set<Group> groups;

    public Board() {
    }

    public Board(Long id, String name, String description, Set<Group> groups) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.groups = groups;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Group> getGroup() {
        return groups;
    }

    public void setGroup(Set<Group> groups) {
        this.groups = groups;
    }

}
