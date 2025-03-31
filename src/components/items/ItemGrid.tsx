
import React from 'react';
import ItemCard from './ItemCard';
import { Item } from '@/context/BidContext';

interface ItemGridProps {
  items: Item[];
  title?: string;
}

const ItemGrid: React.FC<ItemGridProps> = ({ items, title }) => {
  return (
    <div className="mb-10">
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ItemGrid;
