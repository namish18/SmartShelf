
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
        <label className="block text-sm font-medium">Product Name</label>
        <input type="text" name="productName" value={formData.productName} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-primary focus:bg-white focus:ring-0" />
      </div>
      <div>
        <label className="block text-sm font-medium">Category</label>
        <select name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-primary focus:bg-white focus:ring-0">
          <option>Dairy</option>
          <option>Bakery</option>
          <option>Produce</option>
          <option>Meat</option>
          <option>Beverages</option>
          <option>Seafood</option>
        </select>
      </div>
      {/* Add other fields similarly */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">SKU</label>
          <input type="text" name="sku" value={formData.sku} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-primary focus:bg-white focus:ring-0" />
        </div>
        <div>
          <label className="block text-sm font-medium">Quantity</label>
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-primary focus:bg-white focus:ring-0" />
        </div>
      </div>
       <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Purchase Date</label>
          <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-primary focus:bg-white focus:ring-0" />
        </div>
        <div>
          <label className="block text-sm font-medium">Expiry Date</label>
          <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-primary focus:bg-white focus:ring-0" />
        </div>
      </div>
       <div>
          <label className="block text-sm font-medium">Supplier</label>
          <input type="text" name="supplier" value={formData.supplier} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-primary focus:bg-white focus:ring-0" />
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-600">Save</button>
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
                <h2 className="text-3xl font-bold">Manage Inventory</h2>
                <div className="flex items-center gap-2">
                    <button onClick={handleAddNew} className="bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition">Add New Item</button>
                    <button className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700 transition">Scan QR Code</button>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition">Export Report</button>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <input
                    type="text"
                    placeholder="Search by name, SKU, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 mb-4 rounded-lg bg-gray-100 dark:bg-gray-700 border-transparent focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b dark:border-gray-700">
                                <th className="p-3">Product Name</th>
                                <th className="p-3">Category</th>
                                <th className="p-3">SKU</th>
                                <th className="p-3">Quantity</th>
                                <th className="p-3">Purchase Date</th>
                                <th className="p-3">Expiry Date</th>
                                <th className="p-3">Supplier</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInventory.map(item => (
                                <tr key={item.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="p-3">{item.productName}</td>
                                    <td className="p-3">{item.category}</td>
                                    <td className="p-3">{item.sku}</td>
                                    <td className="p-3">{item.quantity}</td>
                                    <td className="p-3">{item.purchaseDate}</td>
                                    <td className="p-3">{item.expiryDate}</td>
                                    <td className="p-3">{item.supplier}</td>
                                    <td className="p-3 flex space-x-2">
                                        <button onClick={() => handleEdit(item)} className="text-blue-500 hover:text-blue-700"><ICONS.Edit className="w-5 h-5" /></button>
                                        <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700"><ICONS.Delete className="w-5 h-5" /></button>
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
