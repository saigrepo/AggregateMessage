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

    public void sendSocketmessage(SocketIOClient senderClient, Message message, UUID room) {
        for (
                SocketIOClient client : senderClient.getNamespace().getRoomOperations(room.toString()).getClients()
        ) {
            if (!client.getSessionId().equals(senderClient.getSessionId())) {
                client.sendEvent("read_message", message);
            }
        }
    }

    public void saveMessage(SocketIOClient senderClient, Message message) {

        Message storedMessage = messageService.saveMessage(
                Message.builder()
                        .messageType(MessageType.CLIENT)
                        .message(message.getMessage())
                        .conversationId(message.getConversationId())
                        .username(message.getUsername())
                        .build()
        );

        sendSocketmessage(senderClient, storedMessage, message.getConversationId());

    }

    public void saveInfoMessage(SocketIOClient senderClient, String message, UUID room) {
        Message storedMessage = messageService.saveMessage(
                Message.builder()
                        .messageType(MessageType.SERVER)
                        .message(message)
                        .conversationId(room)
                        .build()
        );

        sendSocketmessage(senderClient, storedMessage, room);
    }
}