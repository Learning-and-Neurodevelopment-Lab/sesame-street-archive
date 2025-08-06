"use client";

import { Button } from "@/components/ui/button";
import { Pencil, MousePointer2, Trash2, Move, Square, Circle } from "lucide-react";
import { useAtom } from "jotai";
import { toolAtom } from "@/lib/annotation-atoms";

const TOOLTIP = {
  select: "Select/Describe",
  rectangle: "Rectangle",
  // ellipse: "Ellipse",
  // pencil: "Free Draw",
  move: "Move",
  delete: "Delete",
};

export default function Toolbar() {
  const [tool, setTool] = useAtom(toolAtom);

  return (
    <aside className="flex flex-col items-center gap-2 py-4 px-2 bg-white border-r border-neutral-200 shadow-sm min-w-[60px]">
      <Button
        size="icon"
        variant={tool === "select" ? "secondary" : "ghost"}
        aria-label={TOOLTIP.select}
        className="mb-2 mt-2"
        onClick={() => setTool("select")}
      >
        <MousePointer2 className="w-5 h-5" />
      </Button>
      <Button
        size="icon"
        variant={tool === "rectangle" ? "secondary" : "ghost"}
        aria-label={TOOLTIP.rectangle}
        onClick={() => setTool("rectangle")}
      >
        <Square className="w-5 h-5" />
      </Button>
      {/* <Button
        size="icon"
        variant={tool === "ellipse" ? "secondary" : "ghost"}
        aria-label={TOOLTIP.ellipse}
        onClick={() => setTool("ellipse")}
      >
        <Circle className="w-5 h-5" />
      </Button> */}
      {/* <Button
        size="icon"
        // variant={tool === "pencil" ? "secondary" : "ghost"}
        variant="disabled "
        aria-label={TOOLTIP.pencil}
        onClick={() => setTool("pencil")}
        className="opacity-25 cursor-not-allowed"
        disabled
      >
        <Pencil className="w-5 h-5" />
      </Button> */}
      {/* <Button
        size="icon"
        variant={tool === "move" ? "secondary" : "ghost"}
        aria-label={TOOLTIP.move}
        onClick={() => setTool("move")}
      >
        <Move className="w-5 h-5" />
      </Button> */}
      <Button
        size="icon"
        variant={tool === "delete" ? "secondary" : "ghost"}
        aria-label={TOOLTIP.delete}
        onClick={() => setTool("delete")}
      >
        <Trash2 className="w-5 h-5" />
      </Button>
    </aside>
  );
}