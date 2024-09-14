import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import {Conversation} from "../../../models/model-types.ts";

const CreateChatRoom = () => {
    const [participants, setParticipants] = useState<string[]>([]);
    const [conversationName, setConversationName] = useState<string>('');

    const handleParticipantSelection = (userId: string) => {
        if (!participants.includes(userId)) {
            setParticipants([...participants, userId]);
        } else {
            setParticipants(participants.filter((id) => id !== userId));
        }
    };

    const createConversation = async () => {
        const newConversation: Conversation = {
            id: uuidv4(), // Generate UUID for the conversation
            name: conversationName,
            avatar: '', // Optionally handle avatar
            lastMessage: '',
            time: new Date().toISOString(),
            messages: [],
            participants, // Pass selected participants
        };

        // Send the conversation to the backend to create a room
        await fetch('/api/v1/conversation/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newConversation),
        });

        console.log('Conversation created with participants:', participants);
    };

    return (
        <div>
            <h2>Create a Chat Room</h2>
            <input
                type="text"
                placeholder="Conversation Name"
                value={conversationName}
                onChange={(e) => setConversationName(e.target.value)}
            />
            <div>
                <h4>Select Participants:</h4>
                {/* Replace this with your user list */}
                {['user1', 'user2', 'user3'].map((user) => (
                    <div key={user}>
                        <input
                            type="checkbox"
                            onChange={() => handleParticipantSelection(user)}
                        />
                        {user}
                    </div>
                ))}
            </div>
            <button onClick={createConversation}>Create Conversation</button>
        </div>
    );
};

export default CreateChatRoom;
