import { useEffect, useRef, useState } from 'react';
import { CanvasManager } from './lib/canvas';
import { RealtimeManager } from './lib/realtime';
import { generateUserId, generateUserName, assignUserColor, saveUserToStorage, loadUserFromStorage } from './lib/user';
import { Toolbar } from './components/Toolbar';
import { UserList } from './components/UserList';
import { Palette, Users, Undo, Redo } from 'lucide-react';

function App() {
  const canvasRef = useRef(null);
  const canvasManagerRef = useRef(null);
  const realtimeManagerRef = useRef(null);
  const cursorUpdateTimerRef = useRef(null);

  const [roomId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('room') || 'default-room';
  });

  const [currentUser] = useState(() => {
    const stored = loadUserFromStorage();
    if (stored) return stored;

    const userId = generateUserId();
    const userName = generateUserName();
    const userColor = assignUserColor([]);

    saveUserToStorage(userId, userName, userColor);
    return { userId, userName, userColor };
  });

  const [tool, setTool] = useState('brush');
  const [color, setColor] = useState('#000000');
  const [width, setWidth] = useState(3);
  const [users, setUsers] = useState([]);
  const [showToolbar, setShowToolbar] = useState(true);
  const [showUsers, setShowUsers] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasManager = new CanvasManager(canvas);
    canvasManagerRef.current = canvasManager;

    const realtimeManager = new RealtimeManager(
      roomId,
      currentUser.userId,
      currentUser.userName,
      currentUser.userColor
    );
    realtimeManagerRef.current = realtimeManager;

    const initializeApp = async () => {
      await realtimeManager.initialize();

      const operations = await realtimeManager.loadOperations();
      const paths = operations.map(op => ({
        points: op.operation_data.points || [],
        color: op.operation_data.color || '#000000',
        width: op.operation_data.width || 3,
        tool: op.operation_data.tool || 'brush',
        userId: op.user_id,
        userColor: op.user_color
      }));

      canvasManager.redrawAll(paths);

      realtimeManager.onOperation(operation => {
        const path = {
          points: operation.operation_data.points || [],
          color: operation.operation_data.color || '#000000',
          width: operation.operation_data.width || 3,
          tool: operation.operation_data.tool || 'brush',
          userId: operation.user_id,
          userColor: operation.user_color
        };
        canvasManager.drawPath(path);
      });

      realtimeManager.onPresenceUpdate(presence => {
        setUsers(presence);
      });

      realtimeManager.onUndo(async () => {
        const ops = await realtimeManager.loadOperations();
        const pts = ops.map(op => ({
          points: op.operation_data.points || [],
          color: op.operation_data.color || '#000000',
          width: op.operation_data.width || 3,
          tool: op.operation_data.tool || 'brush',
          userId: op.user_id,
          userColor: op.user_color
        }));
        canvasManager.redrawAll(pts);
      });
    };

    initializeApp();

    const handleMouseDown = e => {
      const point = canvasManager.getCanvasPoint(e.clientX, e.clientY);
      canvasManager.startDrawing(point.x, point.y);
      realtimeManager.updateCursor(point.x, point.y, true);
    };

    const handleMouseMove = e => {
      const point = canvasManager.getCanvasPoint(e.clientX, e.clientY);

      if (cursorUpdateTimerRef.current) {
        clearTimeout(cursorUpdateTimerRef.current);
      }

      cursorUpdateTimerRef.current = setTimeout(() => {
        realtimeManager.updateCursor(point.x, point.y, false);
      }, 100);

      canvasManager.continueDrawing(point.x, point.y);
    };

    const handleMouseUp = async () => {
      const path = canvasManager.stopDrawing(currentUser.userId, currentUser.userColor);
      if (path && path.points.length > 1) {
        await realtimeManager.publishDrawOperation(path);
      }
      realtimeManager.updateCursor(0, 0, false);
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      realtimeManager.cleanup();
    };
  }, [roomId, currentUser]);

  useEffect(() => {
    if (canvasManagerRef.current) {
      canvasManagerRef.current.setTool(tool);
    }
  }, [tool]);

  useEffect(() => {
    if (canvasManagerRef.current) {
      canvasManagerRef.current.setColor(color);
    }
  }, [color]);

  useEffect(() => {
    if (canvasManagerRef.current) {
      canvasManagerRef.current.setWidth(width);
    }
  }, [width]);

  const handleUndo = async () => {
    if (realtimeManagerRef.current) {
      await realtimeManagerRef.current.performUndo();
    }
  };

  const handleRedo = async () => {
    if (realtimeManagerRef.current) {
      await realtimeManagerRef.current.performRedo();
    }
  };

  const handleClear = () => {
    if (canvasManagerRef.current) {
      canvasManagerRef.current.clear();
    }
  };

  const otherUsers = users.filter(u => u.user_id !== currentUser.userId);

  return (
    <div className="h-screen w-screen bg-gray-50 overflow-hidden flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Collaborative Canvas</h1>
          <span className="text-sm text-gray-500">Room: {roomId}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: currentUser.userColor }}
            />
            <span className="text-sm font-medium text-gray-700">{currentUser.userName}</span>
          </div>
          <button
            onClick={() => setShowUsers(!showUsers)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Toggle user list"
          >
            <Users size={20} className="text-gray-600" />
          </button>
          <button
            onClick={() => setShowToolbar(!showToolbar)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Toggle toolbar"
          >
            <Palette size={20} className="text-gray-600" />
          </button>
        </div>
      </header>

      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair bg-white"
        />

        {showToolbar && (
          <div className="absolute left-6 top-6">
            <Toolbar
              tool={tool}
              color={color}
              width={width}
              onToolChange={setTool}
              onColorChange={setColor}
              onWidthChange={setWidth}
              onClear={handleClear}
            />
          </div>
        )}

        {showUsers && otherUsers.length > 0 && (
          <div className="absolute right-6 top-6">
            <UserList users={otherUsers} />
          </div>
        )}

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white rounded-lg shadow-lg px-4 py-2">
          <button
            onClick={handleUndo}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Undo (global)"
          >
            <Undo size={20} className="text-gray-700" />
          </button>
          <div className="w-px h-6 bg-gray-300" />
          <button
            onClick={handleRedo}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Redo (global)"
          >
            <Redo size={20} className="text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
