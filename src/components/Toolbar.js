import { Brush, Eraser, Trash2 } from 'lucide-react';

const PRESET_COLORS = [
  '#000000',
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E2',
  '#F8B739',
  '#52B788',
  '#FFFFFF'
];

const WIDTHS = [1, 3, 5, 8, 12];

export function Toolbar({
  tool,
  color,
  width,
  onToolChange,
  onColorChange,
  onWidthChange,
  onClear
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-4 w-64">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Tool</label>
        <div className="flex gap-2">
          <button
            onClick={() => onToolChange('brush')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              tool === 'brush'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Brush size={18} />
            <span>Brush</span>
          </button>

          <button
            onClick={() => onToolChange('eraser')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              tool === 'eraser'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Eraser size={18} />
            <span>Eraser</span>
          </button>
        </div>
      </div>

      {tool === 'brush' && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Color</label>
          <div className="grid grid-cols-6 gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => onColorChange(c)}
                className={`w-8 h-8 rounded-lg border-2 transition-all ${
                  color === c ? 'border-gray-900 scale-110' : 'border-gray-300'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <input
            type="color"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-full h-10 rounded-lg cursor-pointer"
          />
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Width: {width}px
        </label>

        <div className="flex gap-2">
          {WIDTHS.map((w) => (
            <button
              key={w}
              onClick={() => onWidthChange(w)}
              className={`flex-1 h-10 rounded-lg transition-colors flex items-center justify-center ${
                width === w
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onClear}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        <Trash2 size={18} />
        <span>Clear Canvas</span>
      </button>
    </div>
  );
}
