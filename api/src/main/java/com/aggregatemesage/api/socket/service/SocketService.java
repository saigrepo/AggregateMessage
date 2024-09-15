package com.aggregatemesage.api.socket.service;

import com.aggregatemesage.api.socket.model.Message;
import com.aggregatemesage.api.socket.model.MessageType;
import com.corundumstudio.socketio.SocketIOClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SocketService {

    private final MessageService messageService;

    public void sendSocketMessage(SocketIOClient senderClient, Message message, UUID conversationId) {
        senderClient.getNamespace().getRoomOperations(message.getConversationId().toString()).sendEvent("receive_message", message);

    }

    public void saveMessage(SocketIOClient senderClient, Message message) {
        Message storedMessage = messageService.saveMessage(
                Message.builder()
                        .messageId(UUID.randomUUID())
                        .messageType(MessageType.CLIENT)
                        .content(message.getContent())
                        .conversationId(message.getConversationId())
                        .sender(message.getSender())
                        .build()
        );

        sendSocketMessage(senderClient, storedMessage, message.getConversationId());
    }

    public void saveInfoMessage(SocketIOClient senderClient, String message, UUID room) {
        Message storedMessage = messageService.saveMessage(
                Message.builder()
                        .messageType(MessageType.SERVER)
                        .content(message)
                        .conversationId(room)
                        .build()
        );
        sendSocketMessage(senderClient, storedMessage, room);
    }
}