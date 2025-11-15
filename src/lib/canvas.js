export class CanvasManager {
  constructor(canvas) {
    this.canvas = canvas;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Could not get canvas context');
    this.ctx = ctx;

    this.isDrawing = false;
    this.currentPath = [];
    this.currentTool = 'brush';
    this.currentColor = '#000000';
    this.currentWidth = 3;
    this.paths = [];

    this.setupCanvas();
  }

  setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    this.ctx.scale(dpr, dpr);

    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';

    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
  }

  setTool(tool) {
    this.currentTool = tool;
  }

  setColor(color) {
    this.currentColor = color;
  }

  setWidth(width) {
    this.currentWidth = width;
  }

  startDrawing(x, y) {
    this.isDrawing = true;
    this.currentPath = [{ x, y }];
  }

  continueDrawing(x, y) {
    if (!this.isDrawing) return null;

    this.currentPath.push({ x, y });

    this.drawSegment(
      this.currentPath[this.currentPath.length - 2],
      { x, y },
      this.currentColor,
      this.currentWidth,
      this.currentTool
    );

    return this.currentPath;
  }

  stopDrawing(userId, userColor) {
    if (!this.isDrawing || this.currentPath.length === 0) return null;

    this.isDrawing = false;

    const path = {
      points: [...this.currentPath],
      color: this.currentColor,
      width: this.currentWidth,
      tool: this.currentTool,
      userId,
      userColor
    };

    this.paths.push(path);
    this.currentPath = [];

    return path;
  }

  drawPath(path) {
    if (path.points.length < 2) return;

    for (let i = 1; i < path.points.length; i++) {
      this.drawSegment(
        path.points[i - 1],
        path.points[i],
        path.color,
        path.width,
        path.tool
      );
    }
  }

  drawSegment(from, to, color, width, tool) {
    this.ctx.beginPath();
    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);

    if (tool === 'eraser') {
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.strokeStyle = color;
    }

    this.ctx.lineWidth = width;
    this.ctx.stroke();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.paths = [];
  }

  redrawAll(operations) {
    this.clear();
    this.paths = operations;
    operations.forEach(op => this.drawPath(op));
  }

  getCanvasPoint(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  drawCursor(x, y, color, userName) {
    this.ctx.save();

    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2;

    // Cursor circle
    this.ctx.beginPath();
    this.ctx.arc(x, y, 6, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Name label
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x + 10, y - 10, userName.length * 7 + 10, 20);

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '12px sans-serif';
    this.ctx.fillText(userName, x + 15, y + 3);

    this.ctx.restore();
  }

  getPaths() {
    return [...this.paths];
  }
}
