// app/annotate/page.tsx
"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { Stage, Layer, Rect, Ellipse, Image as KonvaImage } from "react-konva";
import { useAtom } from "jotai";
import { toolAtom } from "@/lib/annotation-atoms";
import { Upload, Download, Settings, Check, X } from "lucide-react";
import { useSearchParams } from "next/navigation";

import useImage from "use-image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const MAX_WIDTH = 1024;
const MAX_HEIGHT = 720;

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
  // Use imageUrl from params if available, otherwise allow upload
  const [image, setImage] = useState<string | null>(imageUrl || null);
  const [selectedAnnotation, setSelectedAnnotation] = useState<any | null>(null);
  const [konvaImage] = useImage(image || "");
  const [rectangles, setRectangles] = useState<any[]>([]); // LabelMe 3.0 format
  const [ellipses, setEllipses] = useState<any[]>([]);
  const [newRect, setNewRect] = useState<any | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const stageRef = useRef<any>();
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

  const handleMouseDown = (e: any) => {
    const stage = stageRef.current.getStage();
    const point = stage.getPointerPosition();
    setNewRect({ x: point.x, y: point.y, width: 0, height: 0 });

    if (tool === "select") {
      // Select annotation logic
      return;
    }
    if (tool === "move") {
      // Move annotation logic
      return;
    }

    if (tool === "rectangle" || tool === "ellipse") {
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

  const handleMouseUp = (e) => {
    if (newRect) {
      switch (tool) {
        case "rectangle":
          setRectangles([...rectangles, newRect]);
          break;
        case "ellipse":
          setEllipses([...ellipses, newRect]);
          break;
        case "pencil":
          break;
        case "move":
          break;
        case "delete":
          if (!(e.target.getAttr('image') instanceof HTMLImageElement)) {
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
      // setNewRect(null);
      setIsDrawing(false);
    }
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
        case "m":
        case "v":
          setTool("move");
          break;
        case "d":
        case "t":
          setTool("delete");
          break;
        case "a":
        case "s":
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
        <main className="flex-1 p-8 overflow-auto bg-neutral-50">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-center min-h-[720px] min-w-[1024px] bg-neutral-100">
              <div
                className="flex items-center justify-center"
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
                  className="bg-white"
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
                      <Rect
                        key={i}
                        x={rect.x}
                        y={rect.y}
                        width={rect.width}
                        height={rect.height}
                        stroke={selectedAnnotation === i ? "green" : "red"}
                        strokeWidth={2}
                        draggable={tool === "move"}
                        onMouseOver={(e) => {
                          if (tool === "select" || tool === "delete") {
                            e.target.getStage().container().style.cursor =
                              "pointer";
                          }
                        }}
                        onMouseMove={(e) => {
                          if (tool === "move") {
                            e.target.getStage().container().style.cursor =
                              "move";
                          }
                        }}
                        onMouseOut={(e) => {
                          if (
                            tool === "move" ||
                            tool === "select" ||
                            tool === "delete"
                          ) {
                            e.target.getStage().container().style.cursor =
                              "default";
                          }
                        }}
                        onMouseDown={(e) => {
                          if (tool === "select") {
                           setSelectedAnnotation(i);
                          }
                        }}
                      />
                    ))}
                    {ellipses.map((rect, i) => (
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
                            e.target.getStage().container().style.cursor =
                              "pointer";
                          }
                        }}
                        onMouseMove={(e) => {
                          if (tool === "move") {
                            e.target.getStage().container().style.cursor =
                              "move";
                          }
                        }}
                        onMouseOut={(e) => {
                          if (
                            tool === "move" ||
                            tool === "select" ||
                            tool === "delete"
                          ) {
                            e.target.getStage().container().style.cursor =
                              "default";
                          }
                        }}
                      />
                    ))}
                    <Shape rect={newRect} tool={tool} />
                  </Layer>
                </Stage>
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* Footer/Status Bar */}
      <footer className="h-8 px-6 flex items-center bg-white border-t border-neutral-200 text-xs text-neutral-500">
        Status: Ready
      </footer>
    </>
  );
}
