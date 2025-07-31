import React, { useState, useCallback, useRef, useEffect } from 'react';
import { message } from 'antd';

// Types
interface Point {
  x: number;
  y: number;
  id: string;
}

interface DrawingAnnotation {
  id: string;
  type: "point" | "freehand" | "circle" | "line";
  x?: number;
  y?: number;
  endX?: number;
  endY?: number;
  path?: Point[];
  strokeColor: string;
  strokeWidth: number;
}

type DrawingTool = "point" | "freehand" | "circle" | "line";

const PixelMarker = () => {
  const [markers, setMarkers] = useState<Point[]>([]);
  const [annotations, setAnnotations] = useState<DrawingAnnotation[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const [currentImage, setCurrentImage] = useState<{
    name: string;
    size: { width: number; height: number };
  } | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Drawing state
  const [currentTool, setCurrentTool] = useState<DrawingTool>('point');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [strokeColor, setStrokeColor] = useState('#2563EB');
  const [strokeWidth, setStrokeWidth] = useState(2);
  
  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMarkerRemove = useCallback((index: number) => {
    setMarkers(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleAnnotationRemove = useCallback((id: string) => {
    setAnnotations(prev => prev.filter(annotation => annotation.id !== id));
  }, []);

  const handleClearAll = useCallback(() => {
    setMarkers([]);
    setAnnotations([]);
    message.success("All markers and annotations cleared");
  }, []);

  // Drag and drop handlers
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024) {
      handleFileSelect(file);
    } else {
      message.error("Please select a valid image file (max 10MB)");
    }
  }, [isLoading]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          setCurrentImage({
            name: file.name,
            size: { width: img.width, height: img.height }
          });
          setMarkers([]);
          setAnnotations([]);
          message.success(`${file.name} has been loaded successfully`);
          
          // Initialize canvas after image loads
          setTimeout(() => {
            initializeCanvas(img);
          }, 100);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      message.error("Failed to load image");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Canvas initialization
  const initializeCanvas = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Draw image
    drawCanvas(img);
  }, []);

  // Draw canvas
  const drawCanvas = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate image dimensions to fit canvas
    const canvasAspect = canvas.width / canvas.height;
    const imageAspect = img.width / img.height;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    
    if (imageAspect > canvasAspect) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imageAspect;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawHeight = canvas.height;
      drawWidth = canvas.height * imageAspect;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    }

    // Draw image
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    // Draw markers
    markers.forEach((marker, index) => {
      const x = offsetX + (marker.x / img.width) * drawWidth;
      const y = offsetY + (marker.y / img.height) * drawHeight;
      
      ctx.fillStyle = '#2563EB';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      
      // Draw marker number
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((index + 1).toString(), x, y);
    });

    // Draw annotations
    annotations.forEach((annotation) => {
      ctx.strokeStyle = annotation.strokeColor;
      ctx.lineWidth = annotation.strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      const drawWidth = canvas.width - (offsetX * 2);
      const drawHeight = canvas.height - (offsetY * 2);
      
      switch (annotation.type) {
        case 'point':
          if (annotation.x !== undefined && annotation.y !== undefined) {
            const x = offsetX + (annotation.x / img.width) * drawWidth;
            const y = offsetY + (annotation.y / img.height) * drawHeight;
            ctx.fillStyle = annotation.strokeColor;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
          }
          break;
          
        case 'line':
          if (annotation.x !== undefined && annotation.y !== undefined && 
              annotation.endX !== undefined && annotation.endY !== undefined) {
            const x1 = offsetX + (annotation.x / img.width) * drawWidth;
            const y1 = offsetY + (annotation.y / img.height) * drawHeight;
            const x2 = offsetX + (annotation.endX / img.width) * drawWidth;
            const y2 = offsetY + (annotation.endY / img.height) * drawHeight;
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
          break;
          
        case 'circle':
          if (annotation.x !== undefined && annotation.y !== undefined && 
              annotation.endX !== undefined && annotation.endY !== undefined) {
            const x = offsetX + (annotation.x / img.width) * drawWidth;
            const y = offsetY + (annotation.y / img.height) * drawHeight;
            const endX = offsetX + (annotation.endX / img.width) * drawWidth;
            const endY = offsetY + (annotation.endY / img.height) * drawHeight;
            
            const radius = Math.sqrt(Math.pow(endX - x, 2) + Math.pow(endY - y, 2));
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.stroke();
          }
          break;
          
        case 'freehand':
          if (annotation.path && annotation.path.length > 1) {
            ctx.beginPath();
            const firstPoint = annotation.path[0];
            const x = offsetX + (firstPoint.x / img.width) * drawWidth;
            const y = offsetY + (firstPoint.y / img.height) * drawHeight;
            ctx.moveTo(x, y);
            
            for (let i = 1; i < annotation.path.length; i++) {
              const point = annotation.path[i];
              const x = offsetX + (point.x / img.width) * drawWidth;
              const y = offsetY + (point.y / img.height) * drawHeight;
              ctx.lineTo(x, y);
            }
            ctx.stroke();
          }
          break;
      }
    });

    // Draw preview (dotted lines) for current drawing
    if (isDrawing && startPoint) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.setLineDash([5, 5]); // Create dotted line effect
      
      const drawWidth = canvas.width - (offsetX * 2);
      const drawHeight = canvas.height - (offsetY * 2);
      
      switch (currentTool) {
        case 'line':
          // Draw dotted line from start point to current mouse position
          if (currentPath.length > 0) {
            const currentPoint = currentPath[currentPath.length - 1];
            const x1 = offsetX + (startPoint.x / img.width) * drawWidth;
            const y1 = offsetY + (startPoint.y / img.height) * drawHeight;
            const x2 = offsetX + (currentPoint.x / img.width) * drawWidth;
            const y2 = offsetY + (currentPoint.y / img.height) * drawHeight;
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
          break;
          
        case 'circle':
          // Draw dotted circle from start point to current mouse position
          if (currentPath.length > 0) {
            const currentPoint = currentPath[currentPath.length - 1];
            const x = offsetX + (startPoint.x / img.width) * drawWidth;
            const y = offsetY + (startPoint.y / img.height) * drawHeight;
            const endX = offsetX + (currentPoint.x / img.width) * drawWidth;
            const endY = offsetY + (currentPoint.y / img.height) * drawHeight;
            
            const radius = Math.sqrt(Math.pow(endX - x, 2) + Math.pow(endY - y, 2));
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.stroke();
          }
          break;
          
        case 'freehand':
          // Draw dotted freehand path
          if (currentPath.length > 1) {
            ctx.beginPath();
            const firstPoint = currentPath[0];
            const x = offsetX + (firstPoint.x / img.width) * drawWidth;
            const y = offsetY + (firstPoint.y / img.height) * drawHeight;
            ctx.moveTo(x, y);
            
            for (let i = 1; i < currentPath.length; i++) {
              const point = currentPath[i];
              const x = offsetX + (point.x / img.width) * drawWidth;
              const y = offsetY + (point.y / img.height) * drawHeight;
              ctx.lineTo(x, y);
            }
            ctx.stroke();
          }
          break;
      }
      
      // Reset line dash to solid for other drawings
      ctx.setLineDash([]);
    }
  }, [markers, annotations, isDrawing, startPoint, currentTool, currentPath, strokeColor, strokeWidth]);

  // Canvas mouse down handler
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate image coordinates
    const canvasAspect = canvas.width / canvas.height;
    const imageAspect = image.width / image.height;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    
    if (imageAspect > canvasAspect) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imageAspect;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawHeight = canvas.height;
      drawWidth = canvas.height * imageAspect;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    }

    // Convert to image coordinates
    const imageX = Math.round(((x - offsetX) / drawWidth) * image.width);
    const imageY = Math.round(((y - offsetY) / drawHeight) * image.height);

    // Check if click is within image bounds
    if (imageX < 0 || imageX >= image.width || imageY < 0 || imageY >= image.height) {
      return;
    }

    if (currentTool === 'point') {
      // Add marker
      const newMarker: Point = {
        x: imageX,
        y: imageY,
        id: `marker-${Date.now()}`
      };
      setMarkers(prev => [...prev, newMarker]);
      message.success(`Marker added at (${imageX}, ${imageY})`);
    } else {
      // Start drawing - ensure we start fresh
      const point: Point = { x: imageX, y: imageY, id: `point-${Date.now()}` };
      setIsDrawing(true);
      setStartPoint(point);
      
      if (currentTool === 'freehand') {
        setCurrentPath([point]);
      } else {
        // For line and circle, start with empty path
        setCurrentPath([]);
      }
    }
  }, [image, currentTool]);

  // Canvas mouse move handler
  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate image coordinates (same logic as click handler)
    const canvasAspect = canvas.width / canvas.height;
    const imageAspect = image.width / image.height;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    
    if (imageAspect > canvasAspect) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imageAspect;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawHeight = canvas.height;
      drawWidth = canvas.height * imageAspect;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    }

    const imageX = Math.round(((x - offsetX) / drawWidth) * image.width);
    const imageY = Math.round(((y - offsetY) / drawHeight) * image.height);

    // Only update current path if we're actively drawing (mouse button pressed)
    if (isDrawing && e.buttons === 1) {
      if (currentTool === 'freehand') {
        const point: Point = { x: imageX, y: imageY, id: `point-${Date.now()}` };
        setCurrentPath(prev => [...prev, point]);
      } else if (currentTool === 'line' || currentTool === 'circle') {
        // For line and circle, replace the current path with the current mouse position
        const point: Point = { x: imageX, y: imageY, id: `point-${Date.now()}` };
        setCurrentPath([point]);
      }
    }
  }, [isDrawing, image, currentTool]);

  // Canvas mouse up handler
  const handleCanvasMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint || !image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate image coordinates
    const canvasAspect = canvas.width / canvas.height;
    const imageAspect = image.width / image.height;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    
    if (imageAspect > canvasAspect) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imageAspect;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawHeight = canvas.height;
      drawWidth = canvas.height * imageAspect;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    }

    const imageX = Math.round(((x - offsetX) / drawWidth) * image.width);
    const imageY = Math.round(((y - offsetY) / drawHeight) * image.height);

    let annotation: DrawingAnnotation;

    switch (currentTool) {
      case 'line':
        annotation = {
          id: `annotation-${Date.now()}`,
          type: 'line',
          x: startPoint.x,
          y: startPoint.y,
          endX: imageX,
          endY: imageY,
          strokeColor,
          strokeWidth,
        };
        break;
        
      case 'circle':
        annotation = {
          id: `annotation-${Date.now()}`,
          type: 'circle',
          x: startPoint.x,
          y: startPoint.y,
          endX: imageX,
          endY: imageY,
          strokeColor,
          strokeWidth,
        };
        break;
        
      case 'freehand':
        if (currentPath.length > 1) {
          annotation = {
            id: `annotation-${Date.now()}`,
            type: 'freehand',
            path: [...currentPath, { x: imageX, y: imageY, id: `point-${Date.now()}` }],
            strokeColor,
            strokeWidth,
          };
        } else {
          // Single point freehand becomes a point
          annotation = {
            id: `annotation-${Date.now()}`,
            type: 'point',
            x: startPoint.x,
            y: startPoint.y,
            strokeColor,
            strokeWidth,
          };
        }
        break;
        
      default:
        return;
    }
    
    setAnnotations(prev => [...prev, annotation]);
    
    // Reset all drawing state completely
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPath([]);
    
    message.success(`${currentTool} annotation added`);
  }, [isDrawing, startPoint, currentTool, currentPath, strokeColor, strokeWidth, image]);

  // Canvas mouse leave handler to stop drawing when mouse leaves canvas
  const handleCanvasMouseLeave = useCallback(() => {
    if (isDrawing) {
      // Reset all drawing state completely
      setIsDrawing(false);
      setStartPoint(null);
      setCurrentPath([]);
    }
  }, [isDrawing]);

  // Redraw canvas when markers or annotations change
  useEffect(() => {
    if (image) {
      drawCanvas(image);
    }
  }, [drawCanvas, image]);

  const handleExportData = useCallback(() => {
    const data = {
      image: currentImage,
      markers,
      annotations,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pixel-marker-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success("Data exported successfully");
  }, [currentImage, markers, annotations]);

  const colorOptions = [
    '#2563EB', '#DC2626', '#16A34A', '#CA8A04', '#9333EA', 
    '#EA580C', '#0891B2', '#BE185D', '#000000', '#6B7280'
  ];

  return (
    <div className="sm:grid-cols-2">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-black dark:text-white">
                Image Pixel Marker
              </h3>
              <button
                onClick={() => setShowHelp(true)}
                className="flex items-center space-x-2 text-sm text-meta-3 hover:text-primary"
              >
                <span>?</span>
                <span>Help</span>
              </button>
            </div>
          </div>

          <div className="p-6.5">
            {/* File Upload Section */}
            <div className="mb-6">
              <label className="mb-2.5 block text-black dark:text-white">
                Upload Image <span className="text-meta-1">*</span>
              </label>
              <div 
                className="border-2 border-dashed border-stroke rounded-lg p-8 text-center dark:border-form-strokedark hover:border-primary hover:bg-blue-50 transition-all cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                  className="hidden"
                  id="image-upload"
                />
                <div className="w-12 h-12 mx-auto mb-4 text-meta-3 text-4xl">📁</div>
                <p className="text-lg font-medium text-black dark:text-white mb-2">
                  {isLoading ? 'Loading...' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-sm text-meta-3">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>

            {/* Drawing Tools */}
            {image && (
              <div className="mb-6">
                <h4 className="font-medium text-black dark:text-white mb-4">
                  Drawing Tools
                </h4>
                <div className="bg-slate-50 rounded-lg p-4 border border-stroke dark:border-form-strokedark">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentTool('point')}
                        className={`px-3 py-2 rounded text-sm ${
                          currentTool === 'point' 
                            ? 'bg-primary text-white' 
                            : 'bg-white text-black border border-stroke'
                        }`}
                      >
                        Point
                      </button>
                      <button
                        onClick={() => setCurrentTool('freehand')}
                        className={`px-3 py-2 rounded text-sm ${
                          currentTool === 'freehand' 
                            ? 'bg-primary text-white' 
                            : 'bg-white text-black border border-stroke'
                        }`}
                      >
                        Freehand
                      </button>
                      <button
                        onClick={() => setCurrentTool('line')}
                        className={`px-3 py-2 rounded text-sm ${
                          currentTool === 'line' 
                            ? 'bg-primary text-white' 
                            : 'bg-white text-black border border-stroke'
                        }`}
                      >
                        Line
                      </button>
                      <button
                        onClick={() => setCurrentTool('circle')}
                        className={`px-3 py-2 rounded text-sm ${
                          currentTool === 'circle' 
                            ? 'bg-primary text-white' 
                            : 'bg-white text-black border border-stroke'
                        }`}
                      >
                        Circle
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-black dark:text-white">Color:</span>
                      <div className="flex space-x-1">
                        {colorOptions.map((color) => (
                          <button
                            key={color}
                            onClick={() => setStrokeColor(color)}
                            className={`w-6 h-6 rounded border-2 ${
                              strokeColor === color ? 'border-slate-400' : 'border-slate-200'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-black dark:text-white">Width:</span>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={strokeWidth}
                        onChange={(e) => setStrokeWidth(Number(e.target.value))}
                        className="w-20"
                      />
                      <span className="text-sm text-meta-3">{strokeWidth}px</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={handleExportData}
                      className="flex items-center space-x-2 px-3 py-2 bg-primary text-white rounded hover:bg-opacity-90 text-sm"
                    >
                      <span>⬇</span>
                      <span>Export Data</span>
                    </button>
                    <button
                      onClick={handleClearAll}
                      className="flex items-center space-x-2 px-3 py-2 bg-meta-1 text-white rounded hover:bg-opacity-90 text-sm"
                    >
                      <span>🗑</span>
                      <span>Clear All</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Canvas Area */}
            {image && (
              <div className="mb-6">
                <div className="bg-slate-50 rounded-lg p-4 border border-stroke dark:border-form-strokedark">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-black dark:text-white">
                      {currentImage?.name} ({currentImage?.size.width}×{currentImage?.size.height})
                    </h4>
                    <div className="text-sm text-meta-3">
                      Current Tool: {currentTool.charAt(0).toUpperCase() + currentTool.slice(1)}
                    </div>
                  </div>
                  
                  <div 
                    ref={containerRef}
                    className="relative border border-stroke rounded-lg overflow-hidden dark:border-form-strokedark bg-white"
                    style={{ height: '500px' }}
                  >
                                         <canvas
                       ref={canvasRef}
                       className="absolute inset-0 cursor-crosshair"
                       onMouseDown={handleCanvasMouseDown}
                       onMouseMove={handleCanvasMouseMove}
                       onMouseUp={handleCanvasMouseUp}
                       onMouseLeave={handleCanvasMouseLeave}
                     />
                    
                    {isDrawing && (
                      <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                        Drawing...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Markers List */}
            {markers.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-black dark:text-white mb-4">
                  Marked Points ({markers.length})
                </h4>
                <div className="bg-slate-50 rounded-lg p-4 border border-stroke dark:border-form-strokedark">
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {markers.map((marker, index) => (
                      <div
                        key={marker.id}
                        className="flex justify-between items-center p-3 bg-white rounded border border-stroke dark:bg-boxdark dark:border-form-strokedark"
                      >
                        <div>
                          <span className="font-medium text-black dark:text-white">
                            Marker {index + 1}:
                          </span>
                          <span className="ml-2 text-meta-3">
                            ({marker.x}, {marker.y})
                          </span>
                        </div>
                        <button
                          onClick={() => handleMarkerRemove(index)}
                          className="text-meta-1 hover:text-red-600"
                        >
                          <span>🗑</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Annotations List */}
            {annotations.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-black dark:text-white mb-4">
                  Annotations ({annotations.length})
                </h4>
                <div className="bg-slate-50 rounded-lg p-4 border border-stroke dark:border-form-strokedark">
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {annotations.map((annotation, index) => (
                      <div
                        key={annotation.id}
                        className="flex justify-between items-center p-3 bg-white rounded border border-stroke dark:bg-boxdark dark:border-form-strokedark"
                      >
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: annotation.strokeColor }}
                          />
                          <span className="font-medium text-black dark:text-white">
                            {annotation.type.charAt(0).toUpperCase() + annotation.type.slice(1)} {index + 1}
                          </span>
                        </div>
                        <button
                          onClick={() => handleAnnotationRemove(annotation.id)}
                          className="text-meta-1 hover:text-red-600"
                        >
                          <span>🗑</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-900/20 dark:border-blue-800">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                Instructions
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Upload an image by dragging and dropping or clicking the upload area</li>
                <li>• Select a drawing tool: Point, Freehand, Line, or Circle</li>
                <li>• Click and drag on the image to create annotations</li>
                <li>• Use the Point tool to place markers at specific pixel locations</li>
                <li>• Customize color and stroke width for your annotations</li>
                <li>• Export all data as JSON or clear everything to start over</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-boxdark rounded-lg p-6 max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-black dark:text-white">How to Use</h3>
              <button
                onClick={() => setShowHelp(false)}
                className="text-meta-3 hover:text-primary"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 text-sm text-black dark:text-white">
              <div className="flex space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-semibold text-xs">1</span>
                </div>
                <p>Upload an image by dragging and dropping or clicking the upload area</p>
              </div>
              <div className="flex space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-semibold text-xs">2</span>
                </div>
                <p>Select a drawing tool from the toolbar</p>
              </div>
              <div className="flex space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-semibold text-xs">3</span>
                </div>
                <p>Click and drag on the image to create annotations</p>
              </div>
              <div className="flex space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-semibold text-xs">4</span>
                </div>
                <p>Export your marked points and annotations as JSON data</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PixelMarker; 