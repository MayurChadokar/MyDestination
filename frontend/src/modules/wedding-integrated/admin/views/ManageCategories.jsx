import React, { useState, useEffect } from 'react';
import { weddingDestinationService } from '../../../../services/apiService';
import { weddingService } from '../../../../services/weddingService';
import { adminStyles } from '../theme/themeConfig';
import { Plus, Trash2, Edit2, X, PlusCircle, LayoutGrid, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    type: 'primary',
    parentCategory: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await weddingDestinationService.getCategories();
      if (res.success) {
        setCategories(res.categories || []);
      }
    } catch (error) {
      console.error('Failed to load categories', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from name
    if (name === 'name' && !editingCat) {
      setFormData(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      toast.error('Name and Slug are required');
      return;
    }

    try {
      if (editingCat) {
        await weddingService.updateCategory(editingCat._id, formData);
        toast.success('Category updated successfully');
      } else {
        await weddingService.addCategory(formData);
        toast.success('Category added successfully');
      }
      
      setShowAddForm(false);
      setEditingCat(null);
      setFormData({ name: '', slug: '', description: '', icon: '', type: 'primary', parentCategory: '' });
      fetchCategories();
    } catch (error) {
      toast.error(error.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await weddingService.deleteCategory(id);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const openEdit = (cat) => {
    setEditingCat(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      icon: cat.icon || '',
      type: cat.type || 'primary',
      parentCategory: cat.parentCategory || ''
    });
    setShowAddForm(true);
  };

  const primaryCategories = categories.filter(c => c.type === 'primary' || !c.parentCategory);
  
  return (
    <div className="p-6 md:p-8 space-y-8 pb-32 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`${adminStyles.heading} text-2xl mb-1`}>Manage Categories</h2>
          <p className="text-gray-500 text-sm">Create and organize vendor categories</p>
        </div>
        <button 
          onClick={() => {
            setEditingCat(null);
            setFormData({ name: '', slug: '', description: '', icon: '', type: 'primary', parentCategory: '' });
            setShowAddForm(!showAddForm);
          }}
          className={`${adminStyles.button} px-4 py-2 flex items-center gap-2`}
        >
          {showAddForm ? <X size={18} /> : <Plus size={18} />}
          <span>{showAddForm ? 'Cancel' : 'Add Category'}</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl border border-[hsl(353,45%,35%)]/10 p-6 shadow-sm animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-bold text-[hsl(353,20%,15%)] mb-4">
            {editingCat ? 'Edit Category' : 'Create New Category'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Category Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  className={adminStyles.input}
                  placeholder="e.g. Photographers"
                  required 
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Slug (URL)</label>
                <input 
                  type="text" 
                  name="slug" 
                  value={formData.slug} 
                  onChange={handleInputChange} 
                  className={adminStyles.input}
                  placeholder="e.g. photographers"
                  required 
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Type</label>
                <select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleInputChange} 
                  className={adminStyles.input}
                >
                  <option value="primary">Primary (Parent)</option>
                  <option value="sub">Sub Category</option>
                </select>
              </div>

              {formData.type === 'sub' && (
                <div className="space-y-1 animate-in fade-in zoom-in duration-300">
                  <label className="text-sm font-medium text-gray-700">Parent Category</label>
                  <select 
                    name="parentCategory" 
                    value={formData.parentCategory} 
                    onChange={handleInputChange} 
                    className={adminStyles.input}
                    required={formData.type === 'sub'}
                  >
                    <option value="">Select Parent...</option>
                    {primaryCategories.map(p => (
                      <option key={p._id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Icon / Emoji</label>
                <input 
                  type="text" 
                  name="icon" 
                  value={formData.icon} 
                  onChange={handleInputChange} 
                  className={adminStyles.input}
                  placeholder="e.g. 📷"
                />
              </div>
              
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  className={adminStyles.input}
                  placeholder="Short description"
                  rows={2}
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-2">
              <button type="submit" className={`${adminStyles.button} px-6 py-2`}>
                {editingCat ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading categories...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-[hsl(353,45%,35%)]/10 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-[hsl(353,45%,35%)]/10 text-sm text-gray-500">
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Parent</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(353,45%,35%)]/10">
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[hsl(353,45%,35%)]/10 text-[hsl(353,45%,35%)] flex items-center justify-center shrink-0">
                            {cat.icon || <LayoutGrid size={16} />}
                          </div>
                          <div>
                            <div className="font-bold text-[hsl(353,20%,15%)]">{cat.name}</div>
                            <div className="text-xs text-gray-500">/{cat.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cat.type === 'sub' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                          {cat.type === 'sub' ? 'Sub Category' : 'Primary'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {cat.parentCategory ? (
                          <span className="flex items-center gap-1"><Layers size={14} className="text-gray-400"/> {cat.parentCategory}</span>
                        ) : '-'}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cat.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {cat.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => openEdit(cat)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(cat._id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      No categories found. Click "Add Category" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
