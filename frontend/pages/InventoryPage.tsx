import React, { useState, useMemo } from 'react';
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
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Product Name</label>
        <input type="text" name="productName" value={formData.productName} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-600 focus:ring-1 focus:ring-primary" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Category</label>
        <select name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-600 focus:ring-1 focus:ring-primary">
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
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">SKU</label>
          <input type="text" name="sku" value={formData.sku} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-600 focus:ring-1 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Quantity</label>
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-600 focus:ring-1 focus:ring-primary" />
        </div>
      </div>
       <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Purchase Date</label>
          <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-600 focus:ring-1 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Expiry Date</label>
          <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-600 focus:ring-1 focus:ring-primary" />
        </div>
      </div>
       <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Supplier</label>
          <input type="text" name="supplier" value={formData.supplier} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-600 focus:ring-1 focus:ring-primary" />
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 font-semibold transition">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover font-semibold transition">Save</button>
      </div>
    </form>
  );
};

const InventoryPage: React.FC = () => {
    const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY_DATA);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

    const filteredInventory = useMemo(() => {
        return inventory.filter(item =>
            item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [inventory, searchTerm]);
    
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-3xl font-bold font-heading">Manage Inventory</h2>
                <div className="flex items-center gap-2">
                    <button onClick={handleAddNew} className="bg-primary text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-primary/40 hover:bg-primary-hover font-semibold transition">Add New Item</button>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-green-600/40 hover:bg-green-700 font-semibold transition">Export Report</button>
                </div>
            </div>
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-lg">
                <input
                    type="text"
                    placeholder="Search by name, SKU, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 mb-4 rounded-lg bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border-light dark:border-border-dark">
                                <th className="p-4 font-semibold">Product Name</th>
                                <th className="p-4 font-semibold">Category</th>
                                <th className="p-4 font-semibold">SKU</th>
                                <th className="p-4 font-semibold">Quantity</th>
                                <th className="p-4 font-semibold">Purchase Date</th>
                                <th className="p-4 font-semibold">Expiry Date</th>
                                <th className="p-4 font-semibold">Supplier</th>
                                <th className="p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInventory.map(item => (
                                <tr key={item.id} className="border-b border-border-light dark:border-border-dark hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="p-4 font-medium">{item.productName}</td>
                                    <td className="p-4 text-slate-500 dark:text-slate-400">{item.category}</td>
                                    <td className="p-4 text-slate-500 dark:text-slate-400">{item.sku}</td>
                                    <td className="p-4 font-medium">{item.quantity}</td>
                                    <td className="p-4 text-slate-500 dark:text-slate-400">{item.purchaseDate}</td>
                                    <td className="p-4 text-slate-500 dark:text-slate-400">{item.expiryDate}</td>
                                    <td className="p-4 text-slate-500 dark:text-slate-400">{item.supplier}</td>
                                    <td className="p-4 flex space-x-2">
                                        <button onClick={() => handleEdit(item)} className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-500/10"><ICONS.Edit className="w-5 h-5" /></button>
                                        <button onClick={() => handleDelete(item.id)} className="text-accent-red hover:text-red-700 p-1 rounded-full hover:bg-red-500/10"><ICONS.Delete className="w-5 h-5" /></button>
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