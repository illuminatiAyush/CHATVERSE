const roomManager = require('./roomManager');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('[Socket] User connected:', socket.id);

    socket.on('join_room', ({ roomCode, username }) => {
      console.log(`[Socket] Join attempt: ${username} -> Room ${roomCode}`);
      const result = roomManager.joinRoom(roomCode, socket.id, username);

      if (result.error) {
        console.warn(`[Socket] Join REJECTED for ${username}: ${result.error}`);
        socket.emit('error_message', result.error);
        return;
      }

      socket.join(roomCode);
      
      const users = roomManager.getUsersInRoom(roomCode);
      const room = roomManager.getRoom(roomCode);
      
      // Update everyone in the room with the new user list
      io.to(roomCode).emit('user_list', users);
      
      // Send message history to the joining user
      if (room && room.messages) {
        console.log(`[Socket] Sending ${room.messages.length} messages to ${username}`);
        socket.emit('message_history', room.messages);
      }
      
      // Broadcast join message
      socket.to(roomCode).emit('receive_message', {
        username: 'SYSTEM',
        text: `${username} has entered the multiverse.`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'system'
      });

      console.log(`[Socket] ${username} successfully joined room ${roomCode}`);
    });

    socket.on('create_room', () => {
      console.log('[Socket] Room creation requested');
      const roomCode = roomManager.createRoom();
      console.log('[Socket] Room created:', roomCode);
      socket.emit('room_created', roomCode);
    });

    socket.on('send_message', ({ roomCode, text, username, replyTo }) => {
      const room = roomManager.getRoom(roomCode);
      if (!room) {
        console.warn(`[Socket] Message failed: Room ${roomCode} not found`);
        return;
      }

      const message = {
        username,
        text,
        timestamp: new Date().toLocaleTimeString(),
        serverTime: Date.now(),
        type: 'user'
      };

      // Attach reply reference if replying to a message
      if (replyTo) {
        message.replyTo = {
          username: replyTo.username,
          text: replyTo.text
        };
      }
      
      room.messages.push(message);
      // Limit message history to 50 for performance
      if (room.messages.length > 50) room.messages.shift();
      
      io.to(roomCode).emit('receive_message', message);
      roomManager.saveToPersistence(); // Save history
    });

    socket.on('typing', ({ roomCode, username, isTyping }) => {
      socket.to(roomCode).emit('display_typing', { username, isTyping });
    });

    socket.on('disconnect', () => {
      const leaveData = roomManager.leaveRoom(socket.id);
      if (leaveData) {
        const { roomCode, username } = leaveData;
        const remainingUsers = roomManager.getUsersInRoom(roomCode);
        
        io.to(roomCode).emit('user_list', remainingUsers);
        io.to(roomCode).emit('receive_message', {
          username: 'SYSTEM',
          text: `${username} has left the multiverse.`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'system'
        });
        
        console.log(`[Socket] ${username} left room ${roomCode}`);
      }
      console.log('[Socket] User disconnected:', socket.id);
    });
  });
};
