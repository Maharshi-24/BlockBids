
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import ItemGrid from '@/components/items/ItemGrid';
import { Input } from '@/components/ui/input';
import { useBidContext } from '@/context/BidContext';
import { Search } from 'lucide-react';
import { Item } from '@/context/BidContext';

const ItemsPage = () => {
  const { items } = useBidContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<Item[]>(items);
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Get unique categories
  const categories = ['All', ...Array.from(new Set(items.map(item => item.category)))];
  
  // Filter items based on search term and category
  useEffect(() => {
    let result = items;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(term) || 
        item.description.toLowerCase().includes(term)
      );
    }
    
    if (activeCategory !== 'All') {
      result = result.filter(item => item.category === activeCategory);
    }
    
    setFilteredItems(result);
  }, [searchTerm, activeCategory, items]);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Browse Items</h1>
            <p className="text-gray-600 mt-2">Find the perfect item to bid on and win</p>
          </div>
          
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {/* Categories */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category 
                    ? 'bg-bidzone-purple text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {filteredItems.length > 0 ? (
          <ItemGrid items={filteredItems} />
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ItemsPage;
