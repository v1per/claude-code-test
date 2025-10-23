import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import type { Note } from '@/types';
import StickyNote from './StickyNote';

interface StickyNotesCanvasProps {
  notes: Note[];
  currentUserId?: number;
  onNoteUpdate: (note: Note) => void;
  onNoteDelete: (id: number) => void;
}

export default function StickyNotesCanvas({
  notes,
  currentUserId,
  onNoteUpdate,
  onNoteDelete,
}: StickyNotesCanvasProps) {
  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before drag starts
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const noteId = Number(active.id);
    const note = notes.find(n => n.id === noteId);

    if (!note) return;

    // Calculate new position
    const newPositionX = note.positionX + delta.x;
    const newPositionY = note.positionY + delta.y;

    // Update note with new position
    onNoteUpdate({
      ...note,
      positionX: Math.max(0, newPositionX), // Prevent negative positions
      positionY: Math.max(0, newPositionY),
    });
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="relative w-full h-full bg-gray-50">
        {notes.map(note => (
          <StickyNote
            key={note.id}
            note={note}
            isAuthor={currentUserId === note.userId}
            onUpdate={onNoteUpdate}
            onDelete={onNoteDelete}
          />
        ))}
      </div>
    </DndContext>
  );
}
