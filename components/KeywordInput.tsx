import React, { useRef, useState } from "react";

export function KeywordInput({ value, onChange, suggestions = [] }) {
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const addKeyword = (kw) => {
    if (kw && !value.includes(kw)) {
      onChange([...value, kw]);
    }
    setInput("");
  };

  const removeKeyword = (kw) => {
    onChange(value.filter((k) => k !== kw));
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (input.trim()) addKeyword(input.trim());
    } else if (e.key === "Backspace" && !input && value.length) {
      removeKeyword(value[value.length - 1]);
    }
  };

  const filteredSuggestions = suggestions.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !value.includes(s)
  );

  return (
    <div className="flex flex-wrap gap-1 border rounded p-2 min-h-[40px] bg-white" onClick={() => inputRef.current?.focus()}>
      {value.map((kw) => (
        <span key={kw} className="flex items-center bg-neutral-200 rounded px-2 py-0.5 text-sm mr-1 mb-1">
          {kw}
          <button
            type="button"
            className="ml-1 text-neutral-500 hover:text-red-500"
            onClick={e => { e.stopPropagation(); removeKeyword(kw); }}
            aria-label={`Remove ${kw}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        className="flex-1 min-w-[80px] border-none outline-none bg-transparent"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleInputKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={value.length === 0 ? "Add keyword..." : ""}
        list="keyword-suggestions"
      />
      {focused && filteredSuggestions.length > 0 && (
        <div className="absolute mt-10 bg-white border rounded shadow z-10 w-72 max-h-40 overflow-auto">
          {filteredSuggestions.map((s) => (
            <div
              key={s}
              className="px-3 py-1 hover:bg-neutral-100 cursor-pointer"
              onMouseDown={() => addKeyword(s)}
            >
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
