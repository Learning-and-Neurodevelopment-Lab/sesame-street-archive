// app/annotate/page.tsx
"use client";

import { useState, useRef, useMemo, useEffect, Fragment } from "react";
import { Stage, Layer, Rect, Ellipse, Image as KonvaImage, Transformer, Text, Group } from "react-konva";
import { useAtom } from "jotai";
import { toolAtom } from "@/lib/annotation-atoms";
import { Upload, Download, Settings, Check, X, ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";

import useImage from "use-image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SearchableCombobox } from "@/components/SearchableCombobox";

const MAX_WIDTH = 1024;
const MAX_HEIGHT = 720;

// Annotation categories
const ANNOTATION_CATEGORIES = [
  { value: "places", label: "Places", color: "#22c55e" },
  { value: "faces", label: "Faces", color: "#3b82f6" },
  { value: "numbers", label: "Numbers", color: "#a855f7" },
];

function Shape({
  rect,
  tool,
}: {
  rect: { x: number; y: number; width: number; height: number };
  tool: string;
}) {
  if (rect) {
    switch (tool) {
      case "rectangle":
        return (
          <Rect
            x={rect.x}
            y={rect.y}
            width={rect.width}
            height={rect.height}
            stroke="blue"
            dash={[4, 4]}
          />
        );
      case "ellipse":
        return (
          <Ellipse
            x={rect.x + rect.width / 2}
            y={rect.y + rect.height / 2}
            radiusX={Math.abs(rect.width) / 2}
            radiusY={Math.abs(rect.height) / 2}
            stroke="blue"
            dash={[4, 4]}
          />
        );
      default:
        return null;
    }
  }
}

export default function Tool() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("image");

  const [tool, setTool] = useAtom(toolAtom);
  const [image, setImage] = useState<string | null>(imageUrl || null);
  const [selectedAnnotation, setSelectedAnnotation] = useState<number | null>(null);
  const [konvaImage] = useImage(image || "");
  const [rectangles, setRectangles] = useState<any[]>([]);
  const [ellipses, setEllipses] = useState<any[]>([]);
  const [newRect, setNewRect] = useState<any | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showLabelCombobox, setShowLabelCombobox] = useState(false);
  const [comboboxPosition, setComboboxPosition] = useState({ x: 0, y: 0 });
  const [pendingRectIndex, setPendingRectIndex] = useState<number | null>(null);
  const stageRef = useRef<any>();
  const transformerRef = useRef<any>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate stage size based on image aspect ratio
  const [stageSize, setStageSize] = useState({
    width: MAX_WIDTH,
    height: MAX_HEIGHT,
  });

  // Update stage size when image loads
  useMemo(() => {
    if (konvaImage && konvaImage.width && konvaImage.height) {
      const imgW = konvaImage.width;
      const imgH = konvaImage.height;
      let width = MAX_WIDTH;
      let height = (imgH / imgW) * MAX_WIDTH;
      if (height > MAX_HEIGHT) {
        height = MAX_HEIGHT;
        width = (imgW / imgH) * MAX_HEIGHT;
      }
      setStageSize({ width, height });
    }
  }, [konvaImage]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        const url = new URL(window.location.href);
        url.searchParams.delete("image");
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle transformer changes
  const handleTransformEnd = (e: any) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Reset scale and update width/height instead
    node.scaleX(1);
    node.scaleY(1);

    const newAttrs = {
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
    };

    // Update the rectangle in the array
    if (selectedAnnotation !== null) {
      const newRectangles = rectangles.slice();
      newRectangles[selectedAnnotation] = { ...newRectangles[selectedAnnotation], ...newAttrs };
      setRectangles(newRectangles);
    }
  };

  // Update transformer when selection changes
  useEffect(() => {
    if (selectedAnnotation !== null && transformerRef.current) {
      const selectedNode = stageRef.current?.findOne(`.rect-${selectedAnnotation}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedAnnotation]);

  const handleMouseDown = (e: any) => {
    // Hide combobox when clicking elsewhere
    setShowLabelCombobox(false);
    
    // Deselect when clicking on stage
    if (e.target === e.target.getStage()) {
      setSelectedAnnotation(null);
      return;
    }

    const stage = stageRef.current.getStage();
    const point = stage.getPointerPosition();
    setNewRect({ x: point.x, y: point.y, width: 0, height: 0 });

    if (tool === "select") {
      return;
    }

    if (tool === "rectangle" || tool === "ellipse") {
      setSelectedAnnotation(null); // Deselect when drawing new shape
      setIsDrawing(true);
      return;
    } else {
      setIsDrawing(false);
      return;
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing || !newRect) return;
    const stage = stageRef.current.getStage();
    const point = stage.getPointerPosition();
    const width = point.x - newRect.x;
    const height = point.y - newRect.y;
    setNewRect({ ...newRect, width, height });
  };

  interface AnnotationRect {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    category: string;
    id: number;
  }

  interface KonvaMouseEvent {
    target: any;
  }

  const handleMouseUp = (e: KonvaMouseEvent) => {
    if (
      newRect &&
      Math.abs(newRect.width) > 10 &&
      Math.abs(newRect.height) > 10
    ) {
      const rectWithLabel: AnnotationRect = {
        ...newRect,
        label: "",
        category: "",
        id: Date.now(), // Simple ID generation
      };

      switch (tool) {
        case "rectangle":
          const newRectangles: AnnotationRect[] = [...rectangles, rectWithLabel];
          setRectangles(newRectangles);

          // Show combobox for labeling
          setComboboxPosition({ x: window.innerWidth / 2 - 72, y: window.innerHeight / 2 - 74 });
          setPendingRectIndex(newRectangles.length - 1);
          setShowLabelCombobox(true);
          break;
        case "ellipse":
          setEllipses([...ellipses, rectWithLabel]);
          break;
        case "delete":
          if (!(e.target.getAttr("image") instanceof HTMLImageElement)) {
            e.target?.remove();
          }
          return;
        default:
          break;
      }
    }
    setNewRect(null);
    setIsDrawing(false);
  };

  const handleMouseLeave = () => {
    if (isDrawing) {
      setIsDrawing(false);
    }
  };

  const handleLabelChange = (category: string) => {
    if (pendingRectIndex !== null) {
      const newRectangles = rectangles.slice();
      newRectangles[pendingRectIndex] = {
        ...newRectangles[pendingRectIndex],
        category,
        label: ANNOTATION_CATEGORIES.find(cat => cat.value === category)?.label || ""
      };
      setRectangles(newRectangles);
      setShowLabelCombobox(false);
      setPendingRectIndex(null);
    }
  };

  const getStrokeColor = (rect: any, index: number) => {
    if (selectedAnnotation === index) return "blue";
    if (rect.category) {
      const category = ANNOTATION_CATEGORIES.find(cat => cat.value === rect.category);
      return category?.color || "red";
    }
    return "red";
  };

  const exportAnnotations = () => {
    const data = JSON.stringify(rectangles, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "annotations.json";
    a.click();
  };

  // Keyboard shortcuts for tool selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName || ""))
        return;
      switch (e.key.toLowerCase()) {
        case "r":
          setTool("rectangle");
          break;
        case "e":
          setTool("ellipse");
          break;
        case "p":
          setTool("pencil");
          break;
        case "d":
        case "t":
          setTool("delete");
          break;
        case "a":
        case "s":
        case "v":
          setTool("select");
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setTool]);

  // If imageUrl changes (e.g., navigating to a new image), update image state
  useEffect(() => {
    if (imageUrl) setImage(imageUrl);
  }, [imageUrl]);

  // Type for Konva Stage ref
  interface KonvaStageRef {
    children: any[];
    getStage: () => any;
    content: any;
  }

  // Type for Konva Layer
  interface KonvaLayer {
    children: any[];
  }

  // Type for Konva Group
  // (imported from react-konva, but for runtime check, use typeof Group)
  // interface KonvaGroup {} // Not needed for runtime instanceof

  // Type assertion for stageRef
  const stageRefTyped = stageRef as React.MutableRefObject<KonvaStageRef | null>;

  // console.log(
  //   ((stageRefTyped.current?.children[0]?.children ?? []) as any[]).filter(
  //     (o: any) => o.constructor.name === 'Group'
  //   ).map((group: any) => {
  //     // Do something with each group
  //     return (group?.children ?? []).find((o:any) => o.constructor.name === 'Text');
  //   }).forEach((text: any) => {
  //     console.log('Found text node:', text.textWidth);
  //   })
  // );
  
  // console.log('Stage size:', Array.from(stageRef.current?.children[0]?.children ?? []).filter((layer) => layer === true));

  return (
    <>
      <header className="flex items-center justify-between h-14 px-6 bg-white border-b border-neutral-200 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-lg tracking-tight">
            Annotation Tool
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            className="p-2 rounded-full hover:bg-neutral-200"
            aria-label="Upload"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-5 h-5 text-neutral-700" />
          </Button>
          <Button
            variant="ghost"
            className="p-2 rounded-full hover:bg-neutral-200"
            aria-label="Export"
            onClick={exportAnnotations}
          >
            <Download className="w-5 h-5 text-neutral-700" />
          </Button>
          <Button variant="secondary">
            <Settings className="w-5 h-5 text-neutral-700" />
          </Button>
          <Button variant="danger" asChild>
            <Link href="/dashboard">
              <X className="w-5 h-5 text-neutral-700" />
            </Link>
          </Button>
          <Button variant="success" asChild>
            <Link href="/dashboard">
              <Check className="w-5 h-5 text-neutral-700" />
            </Link>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 p-8 overflow-auto bg-neutral-50 relative">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-center min-h-[720px] min-w-[1024px] bg-neutral-100">
              <div
                className="flex items-center justify-center relative"
                style={{ width: stageSize.width, height: stageSize.height }}
              >
                <Stage
                  width={stageSize.width}
                  height={stageSize.height}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                  ref={stageRef}
                  className="bg-white relative"
                >
                  <Layer>
                    {konvaImage && (
                      <KonvaImage
                        image={konvaImage}
                        width={stageSize.width}
                        height={stageSize.height}
                      />
                    )}
                    {rectangles.map((rect, i) => (
                      <Group 
                        x={rect.x}
                        y={rect.y}
                        key={rect.id || i}
                        onTransformEnd={handleTransformEnd}
                        draggable={tool === "move" || tool === "select"}
                        onMouseOver={(e) => {
                          if (tool === "select" || tool === "delete") {
                            e.target.getStage().container().style.cursor = "pointer";
                          }
                        }}
                        onMouseMove={(e) => {
                          if (tool === "move") {
                            e.target.getStage().container().style.cursor = "move";
                          }
                        }}
                        onMouseOut={(e) => {
                          if (tool === "move" || tool === "select" || tool === "delete") {
                            e.target.getStage().container().style.cursor = "default";
                          }
                        }}
                        onClick={(e) => {
                          // Switch to select/move mode when any group is clicked
                          setTool("select");
                          setSelectedAnnotation(i);
                          
                          // Stop event propagation to prevent stage click handler
                          e.cancelBubble = true;
                        }}
                        onDblClick={(e) => {
                          if (tool === "select") {
                            const rect = stageRef?.current?.content.getBoundingClientRect();  
                            setShowLabelCombobox(true);
                            setComboboxPosition({ x: window.innerWidth / 2 - 72, y: window.innerHeight / 2 - 74 });
                          }
                        }}
                        onDragEnd={(e) => {
                          const newRectangles = rectangles.slice();
                          newRectangles[i] = {
                            ...rect,
                            x: e.target.x(),
                            y: e.target.y(),
                          };
                          setRectangles(newRectangles);
                        }}
                      >
                        <Rect
                          name={`rect-${i}`}
                          width={rect.width}
                          height={rect.height}
                          stroke={getStrokeColor(rect, i)}
                          strokeWidth={2}
                        />
                        {rect.label && (
                          <Text
                            x={rect.width / 2}
                            y={rect.height / 2}
                            text={rect.label}
                            fontSize={12}
                            fill={getStrokeColor(rect, i)}
                            fontStyle="bold"
                          />
                        )}
                      </Group>
                    ))}
                    {/* Transformer for resizing selected rectangles */}
                    <Transformer
                      ref={transformerRef}
                      enabledAnchors={[
                        'top-left',
                        'top-center', 
                        'top-right',
                        'middle-right',
                        'middle-left',
                        'bottom-left',
                        'bottom-center',
                        'bottom-right'
                      ]}
                      centeredScaling={true}
                      rotateEnabled={true}
                      boundBoxFunc={(oldBox, newBox) => {
                        // Limit resize to minimum size
                        if (newBox.width < 5 || newBox.height < 5) {
                          return oldBox;
                        }
                        return newBox;
                      }}
                    />
                    {/* {ellipses.map((rect, i) => (
                      <Ellipse
                        key={i}
                        x={rect.x + rect.width / 2}
                        y={rect.y + rect.height / 2}
                        radiusX={Math.abs(rect.width) / 2}
                        radiusY={Math.abs(rect.height) / 2}
                        stroke="red"
                        strokeWidth={2}
                        draggable={tool === "move"}
                        onMouseOver={(e) => {
                          if (tool === "select" || tool === "delete") {
                            e.target.getStage().container().style.cursor = "pointer";
                          }
                        }}
                        onMouseMove={(e) => {
                          if (tool === "move") {
                            e.target.getStage().container().style.cursor = "move";
                          }
                        }}
                        onMouseOut={(e) => {
                          if (tool === "move" || tool === "select" || tool === "delete") {
                            e.target.getStage().container().style.cursor = "default";
                          }
                        }}
                      />
                    ))} */}
                    <Shape rect={newRect} tool={tool} />
                  </Layer>
                </Stage>
              </div>
            </div>
          </div>
          
          {/* Annotation Combobox */}
          {showLabelCombobox && (
            <SearchableCombobox
              options={ANNOTATION_CATEGORIES}
              value=""
              onChange={handleLabelChange}
              position={comboboxPosition}
              placeholder="Search categories..."
              onCancel={() => {
                setShowLabelCombobox(false);
                setPendingRectIndex(null);
              }}
            />
          )}
        </main>
      </div>
      {/* Footer/Status Bar */}
      <footer className="h-8 px-6 flex items-center bg-white border-t border-neutral-200 text-xs text-neutral-500">
        Status: Ready | Rectangles: {rectangles.length}
      </footer>
    </>
  );
}