"use client";
import { useState, useEffect, useRef } from "react";

interface ComboboxOption {
  value: string;
  label: string;
  color?: string;
}

interface SearchableComboboxProps {
  options: ComboboxOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  position?: { x: number; y: number };
  className?: string;
  multiple?: boolean;
  onCancel?: () => void;
}

export function SearchableCombobox({
  options,
  value,
  onChange,
  placeholder = "Search...",
  position,
  className = "",
  multiple = false,
  onCancel
}: SearchableComboboxProps) {
  const [isOpen, setIsOpen] = useState(!!position);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];
  const selectedOptions = options.filter(opt => selectedValues.includes(opt.value));

  // Filter options based on search query
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    option.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Focus input when component mounts or opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      if (onCancel) {
        onCancel();
      } else {
        setIsOpen(false);
      }
      return;
    }
    
    if (e.key === "Enter" && filteredOptions.length > 0) {
      const firstOption = filteredOptions[0];
      handleOptionSelect(firstOption.value);
      return;
    }
  };

  const handleOptionSelect = (optionValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange(newValues);
    } else {
      onChange(optionValue);
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  const handleRemoveTag = (valueToRemove: string) => {
    if (multiple) {
      const newValues = selectedValues.filter(v => v !== valueToRemove);
      onChange(newValues);
    }
  };

  const baseClasses = position 
    ? "absolute z-50 bg-white border border-gray-300 rounded-lg shadow-lg"
    : "relative bg-white border border-gray-300 rounded-lg";

  const containerStyle = position 
    ? { left: position.x, top: position.y, minWidth: '300px' }
    : {};

  return (
    <div 
      className={`${baseClasses} ${className}`}
      style={containerStyle}
    >
      {/* Selected Tags (for multiple mode) */}
      {multiple && selectedOptions.length > 0 && (
        <div className="p-2 border-b border-gray-200">
          <div className="flex flex-wrap gap-1">
            {selectedOptions.map((option) => (
              <span
                key={option.value}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
              >
                {option.color && (
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: option.color }}
                  />
                )}
                {option.label}
                <button
                  onClick={() => handleRemoveTag(option.value)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className={position ? "p-2 border-b border-gray-200" : "p-2"}>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Options List */}
      {isOpen && (
        <div className="max-h-48 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <label
                  key={option.value}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  {multiple && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleOptionSelect(option.value)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  )}
                  {option.color && (
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: option.color }}
                    />
                  )}
                  <span className="text-sm flex-1">{option.label}</span>
                  {!multiple && isSelected && (
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </label>
              );
            })
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500">
              No options found
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      {position && (
        <div className="px-3 py-2 text-xs text-gray-400 border-t border-gray-200">
          {multiple ? "Click to select/deselect • " : ""}Press Enter to select • Esc to cancel
        </div>
      )}
    </div>
  );
}