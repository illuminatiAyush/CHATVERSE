const fs = require('fs');
const path = require('path');

/**
 * Room Manager to handle room states and user limits.
 * Implements simple JSON persistence to survive server restarts.
 */
class RoomManager {
  constructor() {
    this.persistencePath = path.join(__dirname, 'rooms_db.json');
    this.rooms = new Map(); // roomCode -> { users: Map(socketId -> username), messages: [], ... }
    this.maxUsers = 100;
    
    this.loadFromPersistence();

    // Cleanup stale rooms every 2 minutes
    setInterval(() => this.cleanupRooms(), 2 * 60 * 1000);
  }

  saveToPersistence() {
    try {
      const data = {};
      for (const [code, room] of this.rooms.entries()) {
        data[code] = {
          ...room,
          users: Array.from(room.users.entries()) // Convert Map to Array for JSON
        };
      }
      fs.writeFileSync(this.persistencePath, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('Failed to save rooms to persistence:', err);
    }
  }

  loadFromPersistence() {
    try {
      if (fs.existsSync(this.persistencePath)) {
        const raw = fs.readFileSync(this.persistencePath, 'utf8');
        const data = JSON.parse(raw);
        for (const code in data) {
          const room = data[code];
          // Clear users on load — old socket IDs are invalid after restart
          room.users = new Map();
          this.rooms.set(code, room);
        }
        console.log(`Restored ${Object.keys(data).length} rooms from persistence (users cleared).`);
      }
    } catch (err) {
      console.error('Failed to load rooms from persistence:', err);
      this.rooms = new Map();
    }
  }

  generateRoomCode() {
    const prefixes = ['SPDR', 'VENOM', 'MILES', 'WEB', 'GWEN', 'NOIR', 'PETER', 'STARK', 'CARNG', 'MORBS'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = Math.floor(100 + Math.random() * 899); 
    return `${prefix}${number}`;
  }

  getRoom(roomCode) {
    if (!roomCode) return null;
    const normalizedCode = roomCode.toString().trim().toUpperCase();
    return this.rooms.get(normalizedCode);
  }

  createRoom() {
    let roomCode;
    let attempts = 0;
    do {
      roomCode = this.generateRoomCode();
      attempts++;
    } while (this.rooms.has(roomCode) && attempts < 100);

    const roomData = {
      users: new Map(),
      messages: [],
      createdAt: Date.now(),
      lastActive: Date.now()
    };

    this.rooms.set(roomCode, roomData);
    console.log(`Room created: ${roomCode}`);
    this.saveToPersistence();
    return roomCode;
  }

  joinRoom(rawRoomCode, socketId, username) {
    const roomCode = rawRoomCode?.toString().trim().toUpperCase();
    let room = this.rooms.get(roomCode);
    
    // AUTO-CREATE LOGIC: If room doesn't exist, create it on the fly
    if (!room) {
      console.log(`[RoomManager] Auto-creating dimension: ${roomCode} for user ${username}`);
      const newRoomData = {
        users: new Map(),
        messages: [],
        createdAt: Date.now(),
        lastActive: Date.now()
      };
      this.rooms.set(roomCode, newRoomData);
      this.saveToPersistence();
      room = newRoomData;
    }

    if (room.users.size >= this.maxUsers) return { error: "Dimension full! Try another universe." };

    // Check for duplicate username in this room
    const existingUsers = Array.from(room.users.entries());
    const duplicateEntry = existingUsers.find(([, name]) => name === username);
    
    if (duplicateEntry) {
      const [oldSocketId] = duplicateEntry;
      if (oldSocketId !== socketId) {
        // Same username reconnecting from a new socket (e.g. page refresh) — remove old entry
        room.users.delete(oldSocketId);
        console.log(`[RoomManager] Replacing stale socket for ${username} (old: ${oldSocketId}, new: ${socketId})`);
      } else {
        // Same socket re-joining — no-op, already in room
        return { success: true, room };
      }
    }

    room.users.set(socketId, username);
    room.lastActive = Date.now();
    this.saveToPersistence();
    return { success: true, room };
  }

  leaveRoom(socketId) {
    for (const [roomCode, room] of this.rooms.entries()) {
      if (room.users.has(socketId)) {
        const username = room.users.get(socketId);
        room.users.delete(socketId);
        room.lastActive = Date.now();
        this.saveToPersistence();
        return { roomCode, username };
      }
    }
    return null;
  }

  getUsersInRoom(roomCode) {
    const room = this.getRoom(roomCode);
    return room ? Array.from(room.users.values()) : [];
  }

  cleanupRooms() {
    const NOW = Date.now();
    const GRACE_PERIOD = 10 * 60 * 1000; // 10 minutes grace for empty rooms
    const STALE_PERIOD = 60 * 60 * 1000; // 60 minutes max age
    let changed = false;

    for (const [roomCode, room] of this.rooms.entries()) {
      const isStale = (NOW - room.createdAt) > STALE_PERIOD;
      const isEmpty = room.users.size === 0 && (NOW - room.lastActive) > GRACE_PERIOD;

      if (isStale || isEmpty) {
        this.rooms.delete(roomCode);
        console.log(`Room cleaned up: ${roomCode} (Stale: ${isStale}, Empty: ${isEmpty})`);
        changed = true;
      }
    }
    if (changed) this.saveToPersistence();
  }
}

module.exports = new RoomManager();
