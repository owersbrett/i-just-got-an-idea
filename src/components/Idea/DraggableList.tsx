import { ReactNode, useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';



export interface DraggableListItem {
    id: string;
    node: ReactNode;
}
export interface DraggableListProps {
    items: DraggableListItem[];
}

const DraggableList: React.FC<DraggableListProps> = (props: DraggableListProps) => {
    const [list, setList] = useState<DraggableListItem[]>([]);

    useEffect(() => {
        setList(props.items);
    }, [props.items]);

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;

        const items = Array.from(list);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setList(items);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="list">
                {(provided) => (
                    <ul
                        className="flex space-x-2 p-4"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {list.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided) => (
                                    <li
                                        className="bg-gray-200 p-2 rounded"
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        ref={provided.innerRef}
                                    >
                                        {item.node}
                                    </li>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </ul>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default DraggableList;
