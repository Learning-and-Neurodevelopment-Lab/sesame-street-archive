import React from "react";
import { KeywordInput } from "./KeywordInput";

export function AnnotationDrawer({
  open,
  annotation,
  categories,
  availableKeywords = [],
  onClose,
  onSave,
  onCategoryCreate,
}) {
  const [keywords, setKeywords] = React.useState(annotation?.keywords || []);
  const [category, setCategory] = React.useState(annotation?.category || "");
  const [newCategory, setNewCategory] = React.useState("");

  React.useEffect(() => {
    setKeywords(annotation?.keywords || []);
    setCategory(annotation?.category || "");
  }, [annotation]);

  const handleSave = () => {
    onSave({ ...annotation, keywords, category });
  };

  const handleCategoryCreate = () => {
    if (newCategory.trim()) {
      onCategoryCreate(newCategory.trim());
      setCategory(newCategory.trim());
      setNewCategory("");
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transition-transform duration-300"
      style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Edit Annotation</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-black text-2xl">×</button>
      </div>
      <div className="p-4 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            className="w-full border rounded p-2"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <div className="flex mt-2 gap-2">
            <input
              className="flex-1 border rounded p-2"
              placeholder="New category"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
            />
            <button
              className="px-3 py-1 bg-neutral-200 rounded hover:bg-neutral-300"
              onClick={handleCategoryCreate}
              type="button"
            >
              Add
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Keywords</label>
          <KeywordInput
            value={keywords}
            onChange={setKeywords}
            suggestions={availableKeywords}
          />
        </div>
        {availableKeywords.length > 0 && (
          <div className="mt-2">
            <div className="text-xs text-neutral-500 mb-1">All Keywords:</div>
            <div className="flex flex-wrap gap-1">
              {availableKeywords.map((kw, i) => (
                <span key={i} className="bg-neutral-100 border border-neutral-200 rounded px-2 py-0.5 text-xs">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}
        <button
          className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}
