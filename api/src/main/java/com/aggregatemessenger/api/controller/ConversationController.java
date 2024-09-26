package com.aggregatemessenger.api.controller;

import com.aggregatemessenger.api.configs.JwtConstants;
import com.aggregatemessenger.api.dtos.messageDtos.request.GroupConversationRequestDTO;
import com.aggregatemessenger.api.dtos.messageDtos.response.ConversationDTO;
import com.aggregatemessenger.api.exceptions.ConversationException;
import com.aggregatemessenger.api.exceptions.UserException;
import com.aggregatemessenger.api.model.Conversation;
import com.aggregatemessenger.api.model.User;
import com.aggregatemessenger.api.service.ConversationService;
import com.aggregatemessenger.api.service.JwtService;
import com.aggregatemessenger.api.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/api/v1/conversations")
public class ConversationController {

    private final UserService userService;
    private final ConversationService conversationService;
    private final JwtService jwtService;

    @PostMapping("/single")
    public ResponseEntity<ConversationDTO> createSingleConversation(@RequestBody UUID userId,
                                                                    @RequestHeader(JwtConstants.TOKEN_HEADER) String jwt)
            throws Exception {

        User user = userService.getUserByEmail(jwtService.extractUsername(jwt.substring(7)).toString());
        Conversation conversation = conversationService.createConversation(user, userId);
        log.info("User {} created single conversation: {}", user.getEmailId(), conversation.getId());

        return new ResponseEntity<>(ConversationDTO.fromConversation(conversation), HttpStatus.OK);
    }

    @PostMapping("/group")
    public ResponseEntity<ConversationDTO> createGroupConversation(@RequestBody GroupConversationRequestDTO req,
                                                   @RequestHeader(JwtConstants.TOKEN_HEADER) String jwt)
            throws UserException {

        User user = userService.getUserByEmail(jwtService.extractUsername(jwt.substring(7)).toString());
        Conversation conversation = conversationService.createGroup(req, user);
        log.info("User {} created group conversation: {}", user.getEmailId(), conversation.getId());

        return new ResponseEntity<>(ConversationDTO.fromConversation(conversation), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConversationDTO> findConversationById(@PathVariable("id") UUID id)
            throws ConversationException {

        Conversation conversation = conversationService.findConversationById(id);

        return new ResponseEntity<>(ConversationDTO.fromConversation(conversation), HttpStatus.OK);
    }

    @GetMapping("/user")
    public ResponseEntity<List<ConversationDTO>> findAllConversationsByUserId(@RequestHeader(JwtConstants.TOKEN_HEADER) String jwt)
            throws Exception {

        User user = userService.getUserByEmail(jwtService.extractUsername(jwt.substring(7)).toString());
        List<Conversation> conversations = conversationService.findAllByUserId(user.getId());

        return new ResponseEntity<>(ConversationDTO.fromConversations(conversations), HttpStatus.OK);
    }

    @PutMapping("/{conversationId}/add/{userId}")
    public ResponseEntity<ConversationDTO> addUserToGroup(@PathVariable UUID conversationId, @PathVariable UUID userId,
                                                  @RequestHeader(JwtConstants.TOKEN_HEADER) String jwt)
            throws UserException, ConversationException {

        User user = userService.getUserByEmail(jwtService.extractUsername(jwt.substring(7)).toString());
        Conversation conversation = conversationService.addUserToGroup(userId, conversationId, user);
        log.info("User {} added user {} to group conversation: {}", user.getEmailId(), userId, conversation.getId());

        return new ResponseEntity<>(ConversationDTO.fromConversation(conversation), HttpStatus.OK);
    }

    @PutMapping("/{conversationId}/remove/{userId}")
    public ResponseEntity<ConversationDTO> removeUserFromGroup(@PathVariable UUID conversationId, @PathVariable UUID userId,
                                                       @RequestHeader(JwtConstants.TOKEN_HEADER) String jwt)
            throws UserException, ConversationException {

        User user = userService.getUserByEmail(jwtService.extractUsername(jwt.substring(7)).toString());
        Conversation conversation = conversationService.removeFromGroup(conversationId, userId, user);
        log.info("User {} removed user {} from group conversation: {}", user.getEmailId(), userId, conversation.getId());

        return new ResponseEntity<>(ConversationDTO.fromConversation(conversation), HttpStatus.OK);
    }

    @PutMapping("/{conversationId}/markAsRead")
    public ResponseEntity<ConversationDTO> markAsRead(@PathVariable UUID conversationId,
                                              @RequestHeader(JwtConstants.TOKEN_HEADER) String jwt)
            throws UserException, ConversationException {

        User user = userService.getUserByEmail(jwtService.extractUsername(jwt.substring(7)).toString());
        Conversation conversation = conversationService.markAsRead(conversationId, user);
        log.info("Conversation {} marked as read for user: {}", conversationId, user.getEmailId());

        return new ResponseEntity<>(ConversationDTO.fromConversation(conversation), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteConversation(@PathVariable UUID id,
                                                     @RequestHeader(JwtConstants.TOKEN_HEADER) String jwt)
            throws UserException, ConversationException {

        User user = userService.getUserByEmail(jwtService.extractUsername(jwt.substring(7)).toString());
        conversationService.deleteConversation(id, user.getId());
        log.info("User {} deleted conversation: {}", user.getEmailId(), id);

        return new ResponseEntity<>("Conversation deleted successfully", HttpStatus.OK);
    }

}
