package com.aggregatemessenger.api.controller;

import com.aggregatemessenger.api.configs.JwtConstants;
import com.aggregatemessenger.api.dtos.messageDtos.request.SendMessageRequestDTO;
import com.aggregatemessenger.api.dtos.messageDtos.response.MessageDTO;
import com.aggregatemessenger.api.exceptions.ConversationException;
import com.aggregatemessenger.api.exceptions.MessageException;
import com.aggregatemessenger.api.exceptions.UserException;
import com.aggregatemessenger.api.model.Message;
import com.aggregatemessenger.api.model.User;
import com.aggregatemessenger.api.service.JwtService;
import com.aggregatemessenger.api.service.MessageService;
import com.aggregatemessenger.api.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/messages")
public class MessageController {

    private final UserService userService;
    private final MessageService messageService;
    private final JwtService jwtService;

    @PostMapping("/create")
    public ResponseEntity<MessageDTO> sendMessage(@RequestBody SendMessageRequestDTO req,
                                                  @RequestHeader(JwtConstants.TOKEN_HEADER) String jwt)
            throws ConversationException, UserException {

       User user = userService.getUserByEmail(jwtService.extractUsername(jwt.substring(7)).toString());
        Message message = messageService.sendMessage(req, user.getId());
        log.info("User {} sent message: {}", user.getEmailId(), message.getId());

        return new ResponseEntity<>(MessageDTO.fromMessage(message), HttpStatus.OK);
    }

    @GetMapping("/conversation/{convId}")
    public ResponseEntity<List<MessageDTO>> getChatMessages(@PathVariable UUID convId,
                                                         @RequestHeader(JwtConstants.TOKEN_HEADER) String jwt)
            throws ConversationException, UserException {

       User user = userService.getUserByEmail(jwtService.extractUsername(jwt.substring(7)).toString());
        List<Message> messages = messageService.getConversationMessages(convId, user);

        return new ResponseEntity<>(MessageDTO.fromMessages(messages), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMessage(@PathVariable UUID id,
                                                        @RequestHeader(JwtConstants.TOKEN_HEADER) String jwt)
            throws UserException, MessageException {

       User user = userService.getUserByEmail(jwtService.extractUsername(jwt.substring(7)).toString());
        messageService.deleteMessageById(id, user);
        log.info("User {} deleted message: {}", user.getEmailId(), id);

        return new ResponseEntity<>("Message deleted successfully", HttpStatus.OK);
    }

}
