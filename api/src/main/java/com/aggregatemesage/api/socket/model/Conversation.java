package com.aggregatemesage.api.socket.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column
    private String name;

    @Column
    private String avatar;

    @Column
    private String lastMessage;

    @Column
    private String time;

    @OneToMany(mappedBy = "conversationId", cascade = CascadeType.ALL)
    private List<Message> messages;

    @Column
    private String participants;
}
