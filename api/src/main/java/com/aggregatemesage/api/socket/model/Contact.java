package com.aggregatemesage.api.socket.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Contact {
    @Id
    private Integer id;
    @Column
    private String name;
    @Column
    private String email;
}
