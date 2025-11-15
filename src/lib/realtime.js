import { supabase } from './supabase';
import { DrawPath } from './canvas'; // optional, but doesn’t break JS
// RealtimeChannel import not needed in JS

export class RealtimeManager {
  constructor(roomId, userId, userName, userColor) {
    this.roomId = roomId;
    this.userId = userId;
    this.userName = userName;
    this.userColor = userColor;

    this.channel = null;
    this.presenceChannel = null;

    this.onOperationCallback = null;
    this.onPresenceCallback = null;
    this.onUndoCallback = null;
  }

  async initialize() {
    await this.joinRoom();
    await this.subscribeToOperations();
    await this.subscribeToPresence();
  }

  async joinRoom() {
    const { error } = await supabase
      .from('user_presence')
      .upsert({
        room_id: this.roomId,
        user_id: this.userId,
        user_name: this.userName,
        user_color: this.userColor,
        cursor_x: 0,
        cursor_y: 0,
        is_drawing: false,
        last_seen: new Date().toISOString()
      });

    if (error) console.error('Error joining room:', error);
  }

  async subscribeToOperations() {
    this.channel = supabase
      .channel(`room:${this.roomId}:operations`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'drawing_operations',
          filter: `room_id=eq.${this.roomId}`
        },
        (payload) => {
          const operation = payload.new;
          if (operation.user_id !== this.userId && this.onOperationCallback) {
            this.onOperationCallback(operation);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'drawing_operations',
          filter: `room_id=eq.${this.roomId}`
        },
        (payload) => {
          const operation = payload.new;
          if (this.onUndoCallback) {
            this.onUndoCallback(operation);
          }
        }
      )
      .subscribe();
  }

  async subscribeToPresence() {
    this.presenceChannel = supabase
      .channel(`room:${this.roomId}:presence`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence',
          filter: `room_id=eq.${this.roomId}`
        },
        async () => {
          await this.fetchPresence();
        }
      )
      .subscribe();

    await this.fetchPresence();
  }

  async fetchPresence() {
    const { data, error } = await supabase
      .from('user_presence')
      .select('*')
      .eq('room_id', this.roomId)
      .gte('last_seen', new Date(Date.now() - 30000).toISOString());

    if (!error && data && this.onPresenceCallback) {
      this.onPresenceCallback(data);
    }
  }

  async publishDrawOperation(path) {
    const { error } = await supabase
      .from('drawing_operations')
      .insert({
        room_id: this.roomId,
        user_id: this.userId,
        user_color: this.userColor,
        operation_type: 'draw',
        operation_data: {
          points: path.points,
          color: path.color,
          width: path.width,
          tool: path.tool
        }
      });

    if (error) console.error('Error publishing operation:', error);
  }

  async updateCursor(x, y, isDrawing) {
    const { error } = await supabase
      .from('user_presence')
      .update({
        cursor_x: x,
        cursor_y: y,
        is_drawing: isDrawing,
        last_seen: new Date().toISOString()
      })
      .eq('room_id', this.roomId)
      .eq('user_id', this.userId);

    if (error) console.error('Error updating cursor:', error);
  }

  async loadOperations() {
    const { data, error } = await supabase
      .from('drawing_operations')
      .select('*')
      .eq('room_id', this.roomId)
      .eq('is_undone', false)
      .order('sequence_number', { ascending: true });

    if (error) {
      console.error('Error loading operations:', error);
      return [];
    }

    return data || [];
  }

  async performUndo() {
    const { data, error } = await supabase
      .from('drawing_operations')
      .select('*')
      .eq('room_id', this.roomId)
      .eq('is_undone', false)
      .order('sequence_number', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      console.error('Error finding operation to undo:', error);
      return;
    }

    const { error: updateError } = await supabase
      .from('drawing_operations')
      .update({ is_undone: true })
      .eq('id', data.id);

    if (updateError) console.error('Error undoing operation:', updateError);
  }

  async performRedo() {
    const { data, error } = await supabase
      .from('drawing_operations')
      .select('*')
      .eq('room_id', this.roomId)
      .eq('is_undone', true)
      .order('sequence_number', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      console.error('Error finding operation to redo:', error);
      return;
    }

    const { error: updateError } = await supabase
      .from('drawing_operations')
      .update({ is_undone: false })
      .eq('id', data.id);

    if (updateError) console.error('Error redoing operation:', updateError);
  }

  onOperation(callback) {
    this.onOperationCallback = callback;
  }

  onPresenceUpdate(callback) {
    this.onPresenceCallback = callback;
  }

  onUndo(callback) {
    this.onUndoCallback = callback;
  }

  async cleanup() {
    if (this.channel) {
      await this.channel.unsubscribe();
    }
    if (this.presenceChannel) {
      await this.presenceChannel.unsubscribe();
    }

    await supabase
      .from('user_presence')
      .delete()
      .eq('room_id', this.roomId)
      .eq('user_id', this.userId);
  }
}
