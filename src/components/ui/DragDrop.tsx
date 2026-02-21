import { createContext, useContext, useState, type ReactNode } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DragDropContextType<T> {
  items: T[];
  setItems: (items: T[]) => void;
  activeId: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DragDropContext = createContext<DragDropContextType<any> | null>(null);

interface DragDropProviderProps<T> {
  children: ReactNode;
  items: T[];
  onReorder?: (items: T[]) => void;
}

export function DragDropProvider<T extends { id: string }>({
  children,
  items: initialItems,
  onReorder,
}: DragDropProviderProps<T>) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeIndex = items.findIndex((item) => item.id === active.id);
    const overIndex = items.findIndex((item) => item.id === over.id);

    if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
      setItems(arrayMove(items, activeIndex, overIndex));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeIndex = items.findIndex((item) => item.id === active.id);
    const overIndex = items.findIndex((item) => item.id === over.id);

    if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
      const newItems = arrayMove(items, activeIndex, overIndex);
      setItems(newItems);
      onReorder?.(newItems);
    }
  };

  return (
    <DragDropContext.Provider value={{ items, setItems, activeId }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {children}
      </DndContext>
    </DragDropContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDragDropContext<T>() {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDropContext must be used within DragDropProvider');
  }
  return context as DragDropContextType<T>;
}

interface SortableItemProps {
  id: string;
  children: (props: {
    attributes: ReturnType<typeof useSortable>['attributes'];
    listeners: ReturnType<typeof useSortable>['listeners'];
    setNodeRef: ReturnType<typeof useSortable>['setNodeRef'];
    transform: ReturnType<typeof useSortable>['transform'];
    transition: ReturnType<typeof useSortable>['transition'];
    isDragging: boolean;
  }) => React.ReactNode;
}

export function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'opacity-50' : ''}
    >
      {children({ attributes, listeners, setNodeRef, transform, transition, isDragging })}
    </div>
  );
}

interface SortableListProps {
  items: { id: string }[];
  direction?: 'horizontal' | 'vertical';
  children: React.ReactNode;
}

export function SortableList({ items, direction = 'vertical', children }: SortableListProps) {
  const strategy = direction === 'horizontal'
    ? horizontalListSortingStrategy
    : verticalListSortingStrategy;

  return (
    <SortableContext items={items.map(i => i.id)} strategy={strategy}>
      {children}
    </SortableContext>
  );
}

export { DragOverlay };
