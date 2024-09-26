package com.aggregatemessenger.api.model;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.*;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String conversationName;
    private Boolean isGroup;

    @ManyToMany(fetch = FetchType.EAGER)
    private Set<User> admins = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER)
    private Set<User> users = new HashSet<>();

    @ManyToOne(fetch = FetchType.EAGER)
    private User createdBy;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Message> messages = new ArrayList<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedDate;

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (!(obj instanceof Conversation other)) {
            return false;
        }
        return Objects.equals(conversationName, other.getConversationName())
                && Objects.equals(isGroup, other.getIsGroup())
                && Objects.equals(users, other.getUsers())
                && Objects.equals(createdBy, other.getCreatedBy());
    }

    @Override
    public int hashCode() {
        return Objects.hash(conversationName, isGroup, users, createdBy);
    }

    @Override
    public String toString() {
        return "Conversation {" +
                "id=" + id +
                ", chatName='" + conversationName + '\'' +
                ", isGroup=" + isGroup +
                '}';
    }

}
