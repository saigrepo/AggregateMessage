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
    private UUID messageId;

    @Column
    @Enumerated(EnumType.STRING)
    private MessageType messageType;

    @Column
    private String sender;

    @Column
    private UUID conversationId;

    @Column
    private String content;

    @Column
    private String messagedBy;

    @Column
    @CreationTimestamp
    private LocalDateTime createdAt;

}
