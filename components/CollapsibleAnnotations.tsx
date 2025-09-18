import React, { useState } from "react";
import { cn } from "@/lib/utils";

const getTypeColor = (type: string) => {
  switch (type) {
    case "FACE":
      return "bg-blue-100 text-blue-800";
    case "PLACE":
      return "bg-green-100 text-green-800";
    case "NUMBER":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

function CollapsibleAnnotations({ annotations, hasAnnotations }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-2">
      <button
        type="button"
        className={cn("flex items-center justify-between w-full px-3 py-2 bg-gray-100 rounded border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none", hasAnnotations ? "hover:bg-gray-200" : "cursor-not-allowed opacity-50")}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open ? "true" : "false"}
        aria-controls="annotations-list"
        disabled={!hasAnnotations}
      >
        <span>Annotations</span>
        <svg
          className={cn(`w-4 h-4 ml-2 transition-transform duration-200`, open && "rotate-180", !hasAnnotations && "hidden")}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        id="annotations-list"
        className={`transition-all duration-200 overflow-hidden ${open ? "max-h-40" : "max-h-0"} bg-white border border-t-0 border-gray-200 rounded-b`}
      >
        {open && (
          <div className="p-3">
            {hasAnnotations ? (
              <ul className="space-y-1 max-h-32 overflow-y-auto">
                {annotations.map((ann, idx) => (
                  <li
                    key={idx}
                    className="flex items-center text-xs bg-gray-50 rounded px-2 py-1 border border-gray-100"
                  >
                    <span
                      className={`font-semibold mr-2 px-2 py-0.5 rounded-full ${getTypeColor(ann.category?.toLowerCase?.() || ann.category)}`}
                    >
                      {ann.category}
                    </span>
                    <span className="text-gray-400 mx-1">|</span>
                    <span className="truncate text-gray-700">
                      {Array.isArray(ann.keywords)
                        ? ann.keywords.join(", ")
                        : ann.keywords}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-xs text-gray-400">
                No annotations available.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CollapsibleAnnotations;