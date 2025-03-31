
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Item } from '@/context/BidContext';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight, Award, Users } from 'lucide-react';

interface ItemCardProps {
  item: Item;
  index?: number; // Added for staggered animations
}

const ItemCard: React.FC<ItemCardProps> = ({ item, index = 0 }) => {
  const navigate = useNavigate();
  
  // Calculate staggered animation delay based on item index
  const animationDelay = `${index * 0.1}s`;
  
  return (
    <div 
      className="blockbid-card glow group hover:transform hover:scale-105 transition-all duration-300 animate-fade-in"
      style={{ animationDelay }}
      onClick={() => navigate(`/items/${item.id}`)}
    >
      <div className="relative overflow-hidden cursor-pointer">
        <img 
          src={`${item.imageUrl}?auto=format&fit=crop&w=600&h=400`}
          alt={item.name}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blockbid-dark to-transparent group-hover:opacity-80 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="flex justify-between items-center">
            <span className="text-blockbid-secondary font-bold group-hover:scale-110 transition-transform duration-300">{item.basePrice} POL</span>
            <div className="flex items-center gap-1 text-white text-sm px-2 py-1 rounded-full bg-blockbid-blue/50 backdrop-blur-sm group-hover:bg-blockbid-accent/50 transition-all duration-300">
              <Clock size={14} className="text-blockbid-secondary animate-pulse" />
              <span>{item.timeLeft}</span>
            </div>
          </div>
        </div>
        
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blockbid-accent/80 text-white backdrop-blur-sm group-hover:bg-blockbid-tertiary/80 transition-all duration-300">
            {item.category}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold truncate text-white group-hover:text-blockbid-secondary transition-colors duration-300">{item.name}</h3>
        <p className="text-blockbid-light-gray text-sm mb-4 line-clamp-2">{item.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-blockbid-light-gray text-sm">
            <Users size={14} className="mr-1 text-blockbid-secondary group-hover:animate-pulse" />
            <span>{item.bids} bids</span>
          </div>
          <Button 
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              navigate(`/items/${item.id}`);
            }}
            className="bg-blockbid-accent hover:bg-blockbid-accent-hover group-hover:scale-105 transition-all duration-300"
            size="sm"
          >
            Bid Now <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
