// Radix UI ContextMenu wrapper for Konva rectangles
import { ContextMenu } from 'radix-ui';

export function RectangleContextMenu({ children, onEdit, onDelete }) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        {children}
      </ContextMenu.Trigger>
      <ContextMenu.Content className="z-50 min-w-[160px] rounded-md bg-white p-1 shadow-lg border border-neutral-200">
        <ContextMenu.Item className="px-2 py-1.5 cursor-pointer hover:bg-neutral-100 rounded" onSelect={onEdit}>
          Edit
        </ContextMenu.Item>
        <ContextMenu.Item className="px-2 py-1.5 cursor-pointer hover:bg-red-100 text-red-600 rounded" onSelect={onDelete}>
          Delete
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
