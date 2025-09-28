import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MOCK_INVENTORY_DATA, ICONS } from '../constants';
import { InventoryItem } from '../types';
import Modal from '../components/Modal';

const AddEditItemForm: React.FC<{
  item: Partial<InventoryItem> | null;
  onSave: (item: InventoryItem) => void;
  onCancel: () => void;
}> = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<InventoryItem>>(
    item || {
      productName: '',
      category: 'Dairy',
      sku: '',
      quantity: 0,
      purchaseDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date().toISOString().split('T')[0],
      supplier: ''
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      ...formData,
      id: item?.id || Date.now(),
      quantity: Number(formData.quantity)
    } as InventoryItem;
    onSave(newItem);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Product Name</label>
        <input type="text" name="productName" value={formData.productName} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-transparent focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Category</label>
        <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-transparent focus:outline-none focus:ring-2 focus:ring-primary">
          <option>Dairy</option>
          <option>Bakery</option>
          <option>Produce</option>
          <option>Meat</option>
          <option>Beverages</option>
          <option>Seafood</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">SKU</label>
          <input type="text" name="sku" value={formData.sku} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-transparent focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Quantity</label>
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-transparent focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>
       <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Purchase Date</label>
          <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-transparent focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Expiry Date</label>
          <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-transparent focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>
       <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Supplier</label>
          <input type="text" name="supplier" value={formData.supplier} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-transparent focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 font-semibold transition-colors">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover font-semibold transition-colors">Save</button>
      </div>
    </form>
  );
};

const InventoryPage: React.FC = () => {
    const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY_DATA);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false);
    const categoryFilterRef = useRef<HTMLDivElement>(null);

    const allCategories = useMemo(() => {
        const categories = new Set(MOCK_INVENTORY_DATA.map(item => item.category));
        return Array.from(categories).sort();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (categoryFilterRef.current && !categoryFilterRef.current.contains(event.target as Node)) {
                setIsCategoryFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filteredInventory = useMemo(() => {
        let filtered = inventory;

        if (selectedCategories.length > 0) {
            filtered = filtered.filter(item => selectedCategories.includes(item.category));
        }

        const lowercasedSearchTerm = searchTerm.toLowerCase().trim();
        if (lowercasedSearchTerm) {
            const keywords = lowercasedSearchTerm.split(' ').filter(kw => kw.length > 0);
            filtered = filtered.filter(item => {
                const itemCorpus = `${item.productName} ${item.sku} ${item.supplier}`.toLowerCase();
                return keywords.every(keyword => itemCorpus.includes(keyword));
            });
        }

        return filtered;
    }, [inventory, searchTerm, selectedCategories]);
    
    const handleAddNew = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };
    
    const handleEdit = (item: InventoryItem) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };
    
    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            setInventory(prev => prev.filter(item => item.id !== id));
        }
    };
    
    const handleSave = (item: InventoryItem) => {
        if (editingItem) {
            setInventory(prev => prev.map(i => (i.id === item.id ? item : i)));
        } else {
            setInventory(prev => [item, ...prev]);
        }
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCategories([]);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold font-heading">Inventory</h1>
                <button onClick={handleAddNew} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover font-semibold transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
                    <ICONS.Plus className="w-5 h-5" />
                    <span>Add Item</span>
                </button>
            </div>
            <div className="bg-card-light dark:bg-card-dark p-4 sm:p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                    <div className="flex-grow w-full">
                         <input
                            type="text"
                            placeholder="Search by product, SKU, supplier..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    
                    <div className="relative w-full sm:w-auto" ref={categoryFilterRef}>
                        <button
                            onClick={() => setIsCategoryFilterOpen(!isCategoryFilterOpen)}
                            className="w-full sm:w-auto flex items-center justify-between p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700 text-left"
                        >
                            <span className="mr-2 whitespace-nowrap">
                                {selectedCategories.length > 0 ? `Category (${selectedCategories.length})` : 'All Categories'}
                            </span>
                            <ICONS.ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isCategoryFilterOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isCategoryFilterOpen && (
                            <div className="absolute top-full right-0 mt-2 w-full sm:w-56 bg-card-light dark:bg-card-dark rounded-lg shadow-lg border border-border-light dark:border-border-dark z-10 animate-scale-in origin-top-right">
                                <div className="p-2 max-h-60 overflow-y-auto">
                                    {allCategories.map(category => (
                                        <label key={category} className="flex items-center p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(category)}
                                                onChange={() => handleCategoryChange(category)}
                                                className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary bg-transparent dark:bg-transparent"
                                            />
                                            <span className="ml-3 text-sm font-medium">{category}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {(searchTerm || selectedCategories.length > 0) && (
                        <button
                            onClick={handleClearFilters}
                            className="w-full sm:w-auto p-3 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-semibold transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border-light dark:border-border-dark">
                                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Product</th>
                                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Category</th>
                                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">SKU</th>
                                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Quantity</th>
                                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Supplier</th>
                                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInventory.map(item => (
                                <tr key={item.id} className="border-b border-border-light dark:border-border-dark last:border-b-0">
                                    <td className="p-4 font-medium">{item.productName}</td>
                                    <td className="p-4 text-slate-500 dark:text-slate-400">{item.category}</td>
                                    <td className="p-4 text-slate-500 dark:text-slate-400">{item.sku}</td>
                                    <td className="p-4 font-medium">{item.quantity}</td>
                                    <td className="p-4 text-slate-500 dark:text-slate-400">{item.supplier}</td>
                                    <td className="p-4 flex space-x-2 justify-end">
                                        <button onClick={() => handleEdit(item)} className="text-slate-500 hover:text-primary p-2 rounded-md hover:bg-primary/10 transition-colors"><ICONS.Edit className="w-5 h-5" /></button>
                                        <button onClick={() => handleDelete(item.id)} className="text-slate-500 hover:text-accent-red p-2 rounded-md hover:bg-accent-red/10 transition-colors"><ICONS.Delete className="w-5 h-5" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Item' : 'Add New Item'}>
                <AddEditItemForm 
                  item={editingItem} 
                  onSave={handleSave} 
                  onCancel={() => setIsModalOpen(false)} 
                />
            </Modal>
        </div>
    );
};

export default InventoryPage;