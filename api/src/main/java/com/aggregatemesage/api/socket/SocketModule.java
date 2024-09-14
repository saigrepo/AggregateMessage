package com.aggregatemesage.api.socket;

import com.aggregatemesage.api.socket.model.Message;
import com.aggregatemesage.api.socket.service.SocketService;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DataListener;
import com.corundumstudio.socketio.listener.DisconnectListener;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Slf4j
@Component
public class SocketModule {

    private final SocketIOServer server;
    private final SocketService socketService;

    public SocketModule(SocketIOServer server, SocketService socketService) {
        this.server = server;
        this.socketService = socketService;
        server.addConnectListener(onConnected());
        server.addDisconnectListener(onDisconnected());
        server.addEventListener("send_message", Message.class, onChatReceived());
        server.addEventListener("join_conversation", String.class, onConversationJoined());
    }

    private DataListener<Message> onChatReceived() {
        return (senderClient, data, ackSender) -> {
            log.info("Received message: {}", data.toString());
            socketService.saveMessage(senderClient, data);  // Save message
            server.getRoomOperations(data.getConversationId().toString()).sendEvent("receive_message", data);  // Broadcast
        };
    }

    private DataListener<String> onConversationJoined() {
        return (client, conversationStr, ackSender) -> {
            UUID conversationId = UUID.fromString(conversationStr);
            client.joinRoom(conversationId.toString());
            log.info("User [{}] joined conversation [{}]", client.getSessionId(), conversationId);
        };
    }

    private ConnectListener onConnected() {
        return client -> {
            String username = client.getHandshakeData().getSingleUrlParam("username");
            log.info("User [{}] connected", username);
        };
    }

    private DisconnectListener onDisconnected() {
        return client -> {
            String username = client.getHandshakeData().getSingleUrlParam("username");
            log.info("User [{}] disconnected", username);
        };
    }
}
