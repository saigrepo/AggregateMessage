package com.aggregatemesage.api.socket.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Builder
@Getter
@Setter
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column
    @Enumerated(EnumType.STRING)
    private MessageType messageType;

    @Column
    private UUID conversationId;

    @Column
    private String username;

    @Column
    private String message;

    @Column
    @CreationTimestamp
    private LocalDateTime createdAt;

    public Message(String message) {
    }
}
