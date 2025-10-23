import { useState, useRef, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Note } from '@/types';
import { STICKY_NOTE_COLORS } from '@notes-app/shared';

interface StickyNoteProps {
  note: Note;
  isAuthor: boolean;
  onUpdate: (note: Note) => void;
  onDelete: (id: number) => void;
}

export default function StickyNote({ note, isAuthor, onUpdate, onDelete }: StickyNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: note.id,
    disabled: isEditing, // Disable dragging when editing
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    position: 'absolute' as const,
    left: `${note.positionX}px`,
    top: `${note.positionY}px`,
    backgroundColor: note.color,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : isEditing ? 'text' : 'grab',
    zIndex: isDragging ? 1000 : isEditing ? 999 : 1,
  };

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };

    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showColorPicker]);

  const handleSave = () => {
    if (title.trim() && content.trim()) {
      onUpdate({
        ...note,
        title: title.trim(),
        content: content.trim(),
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTitle(note.title);
    setContent(note.content);
    setIsEditing(false);
  };

  const handleColorChange = (color: string) => {
    onUpdate({
      ...note,
      color,
    });
    setShowColorPicker(false);
  };

  const handleDoubleClick = () => {
    if (isAuthor) {
      setIsEditing(true);
    }
  };

  const colorValues = Object.values(STICKY_NOTE_COLORS);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-64 h-64 shadow-lg rounded-lg p-4 flex flex-col"
      onDoubleClick={handleDoubleClick}
      {...attributes}
      {...listeners}
    >
      {/* Header with controls */}
      <div className="flex justify-between items-start mb-2">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 bg-transparent border-b border-gray-400 font-semibold text-gray-900 focus:outline-none focus:border-gray-600"
            placeholder="Title"
            autoFocus
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <h3 className="font-semibold text-gray-900 truncate flex-1">{note.title}</h3>
        )}

        {isAuthor && (
          <div className="flex gap-1 ml-2" onMouseDown={(e) => e.stopPropagation()}>
            {/* Color picker button */}
            <div className="relative" ref={colorPickerRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowColorPicker(!showColorPicker);
                }}
                className="w-6 h-6 rounded border-2 border-gray-400 hover:border-gray-600 transition-colors"
                style={{ backgroundColor: note.color }}
                title="Change color"
              />

              {showColorPicker && (
                <div className="absolute top-8 right-0 bg-white rounded-lg shadow-xl p-2 grid grid-cols-3 gap-2 z-50">
                  {colorValues.map((color) => (
                    <button
                      key={color}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleColorChange(color);
                      }}
                      className="w-8 h-8 rounded border-2 hover:border-gray-600 transition-colors"
                      style={{
                        backgroundColor: color,
                        borderColor: color === note.color ? '#374151' : '#d1d5db',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-red-600 hover:bg-white/50 rounded transition-colors"
              title="Delete note"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full bg-transparent resize-none focus:outline-none text-gray-800"
            placeholder="Note content..."
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <p className="text-gray-800 whitespace-pre-wrap break-words overflow-y-auto h-full">
            {note.content}
          </p>
        )}
      </div>

      {/* Edit controls */}
      {isEditing && (
        <div className="flex gap-2 mt-2 pt-2 border-t border-gray-400" onMouseDown={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSave();
            }}
            className="flex-1 bg-gray-800 hover:bg-gray-900 text-white text-sm py-1 rounded transition-colors"
          >
            Save
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCancel();
            }}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm py-1 rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Author badge (only visible when not editing) */}
      {!isEditing && isAuthor && (
        <div className="mt-2 pt-2 border-t border-gray-400">
          <span className="text-xs text-gray-600 italic">Double-click to edit</span>
        </div>
      )}
    </div>
  );
}
