package com.aggregatemesage.api.socket;

import com.aggregatemesage.api.socket.model.Conversation;
import com.aggregatemesage.api.socket.model.Message;
import com.aggregatemesage.api.socket.service.ConversationService;
import com.aggregatemesage.api.socket.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/conversation")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class SocketController {

    private final MessageService messageService;
    private final ConversationService conversationService;

    @GetMapping("/{conversationId}/messages")
    public List<Message> getMessages(@PathVariable UUID conversationId) {
        return messageService.getMessagesByConversation(conversationId);
    }

    @PostMapping("/create")
    public Conversation createConversation(@RequestBody Conversation conversation) {
        return conversationService.saveConversation(conversation);
    }

    @GetMapping("/{id}")
    public Optional<Conversation> getConversation(@PathVariable UUID id) {
        return conversationService.getConversation(id);
    }

    @GetMapping("/convs")
    public List<Conversation> getConversations() {
        List<Conversation> lst = conversationService.getAllConversations();
        return lst;
    }
}
