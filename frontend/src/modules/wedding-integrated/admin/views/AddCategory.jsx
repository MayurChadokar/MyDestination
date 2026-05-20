import React, { useState, useEffect } from 'react';
import { adminStyles } from '../theme/themeConfig';
import { Plus, Save, Tag, FolderPlus, HelpCircle, Layers, Link as LinkIcon, Compass, UploadCloud, Trash2, Edit } from 'lucide-react';
import { weddingDestinationService } from '../../../../services/apiService';
import { weddingService } from '../../../../services/weddingService';
import toast from 'react-hot-toast';

const AddCategory = () => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    type: 'primary',
    parentCategory: '',
    image: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await weddingDestinationService.getCategories();
      if (res.success) {
        setCategories(res.categories || []);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-generate slug from name
      if (name === 'name') {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
      }
      return updated;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB!");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      toast.error("Please enter a category name and slug!");
      return;
    }

    try {
      setLoading(true);
      await weddingService.addCategory(formData);
      toast.success(`Category "${formData.name}" added successfully!`);
      
      // Reset form
      setFormData({
        name: '',
        slug: '',
        description: '',
        icon: '',
        type: 'primary',
        parentCategory: '',
        image: ''
      });
      
      // Refresh category list
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(error.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the category "${name}"?`)) return;
    try {
      setLoading(true);
      await weddingService.deleteCategory(id);
      toast.success(`Category "${name}" deleted successfully!`);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(error.message || 'Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif text-[hsl(353,45%,35%)]">Add Vendor Category</h2>
          <p className="text-gray-500 text-sm mt-1">Create a new service category or sub-category for wedding planners and partners</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className={`${adminStyles.primaryButton} flex items-center gap-2 px-8 py-3 rounded-2xl font-bold shadow-xl shadow-[hsl(353,45%,35%)]/20 active:scale-95 transition-all disabled:opacity-55`}
        >
          <Save size={20} />
          {loading ? 'Saving...' : 'Save Category'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`${adminStyles.glassCard} p-8 rounded-3xl space-y-6`}>
             <h3 className={`${adminStyles.heading} text-xl font-bold flex items-center gap-2`}>
                <FolderPlus size={22} className="text-[hsl(353,45%,35%)]" /> Category Information
             </h3>
             
             <div className="space-y-4">
                {/* Category Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Makeup Artists, Photographers"
                    className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[hsl(353,45%,35%)] transition-all duration-300"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                    <LinkIcon size={14} className="text-gray-400" /> URL Slug (Auto-generated)
                  </label>
                  <input 
                    type="text" 
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="e.g. makeup-artists"
                    className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[hsl(353,45%,35%)] transition-all duration-300 font-mono text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Category Type */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                      <Layers size={14} className="text-gray-400" /> Type
                    </label>
                    <select 
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[hsl(353,45%,35%)] transition-all duration-300 text-sm"
                    >
                      <option value="primary">Primary Category</option>
                      <option value="sub">Sub Category</option>
                    </select>
                  </div>

                  {/* Icon Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                      <Compass size={14} className="text-gray-400" /> Icon Code / Emoji
                    </label>
                    <input 
                      type="text" 
                      name="icon"
                      value={formData.icon}
                      onChange={handleInputChange}
                      placeholder="e.g. camera, music, flower"
                      className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[hsl(353,45%,35%)] transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Parent Category Selector (If sub-category is selected) */}
                {formData.type === 'sub' && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Parent Category</label>
                    <select 
                      name="parentCategory"
                      value={formData.parentCategory}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[hsl(353,45%,35%)] transition-all duration-300 text-sm"
                    >
                      <option value="">Select Parent Category...</option>
                      {categories.filter(c => c.type === 'primary').map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Provide a brief description of the services offered under this category..."
                    className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[hsl(353,45%,35%)] transition-all duration-300 text-sm"
                  />
                </div>
             </div>
          </div>
        </div>

        {/* Cover Photo & Guidelines Sidebar */}
        <div className="space-y-6">
          {/* Category Cover Photo */}
          <div className={`${adminStyles.glassCard} p-6 rounded-3xl space-y-4`}>
            <label className="block text-sm font-bold text-gray-700">Category Cover Photo</label>
            
            {formData.image ? (
              <div className="relative rounded-2xl overflow-hidden group aspect-[4/3] shadow-md">
                <img 
                  src={formData.image} 
                  alt="Category Preview" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button 
                    onClick={removeImage}
                    className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all duration-200 transform scale-75 group-hover:scale-100 shadow-lg"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-[hsl(353,45%,35%)] rounded-2xl p-6 cursor-pointer bg-white/50 hover:bg-[hsl(353,45%,98%)] transition-all duration-300 group aspect-[4/3]">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="p-3 rounded-2xl bg-[hsl(353,45%,95%)] text-[hsl(353,45%,35%)] group-hover:scale-110 transition-transform duration-300">
                    <UploadCloud size={24} />
                  </div>
                  <span className="text-sm font-bold text-gray-700 mt-1">Upload Cover Photo</span>
                  <span className="text-[10px] text-gray-400">Supports JPG, PNG (Max 5MB)</span>
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="p-6 bg-gradient-to-br from-[hsl(353,45%,35%)] to-[hsl(353,45%,45%)] rounded-3xl text-white shadow-xl">
             <h4 className="font-bold flex items-center gap-2 mb-2">
                <HelpCircle size={18} /> Quick Guidelines
             </h4>
             <ul className="text-xs opacity-90 leading-relaxed space-y-2 list-disc list-inside">
                <li>Primary categories appear directly in the navigation menus and main filters.</li>
                <li>Sub-categories can be associated with primary categories to group related services together.</li>
                <li>The slug determines the unique URL for this category's filter pages and is auto-generated.</li>
                <li>Icons codes should correspond to standard Lucide icons or raw emojis.</li>
             </ul>
          </div>
        </div>
      </div>

      {/* Category List Section (Unified Command Center) */}
      <div className={`${adminStyles.glassCard} p-8 rounded-3xl space-y-6 shadow-lg border border-white/30 bg-white/40`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[hsl(353,45%,35%)]/10 text-[hsl(353,45%,35%)]">
              <Layers size={22} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[hsl(353,20%,15%)]">Active Vendor Categories</h3>
              <p className="text-gray-500 text-xs mt-0.5">Real-time status of all primary and sub-categories in the system</p>
            </div>
          </div>
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[hsl(353,45%,35%)] text-white shadow-sm">
            {categories.length} Categories
          </span>
        </div>

        <div className="overflow-hidden border border-gray-100 rounded-2xl shadow-sm bg-white/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="p-4 pl-6">Category & Slug</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Parent Category</th>
                  <th className="p-4 text-center">Icon / Emoji</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {categories.length > 0 ? (
                  categories.map((cat) => {
                    const fallbackImg = "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=150&auto=format&fit=crop";
                    return (
                      <tr key={cat._id} className="hover:bg-white/40 transition-colors group">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm shrink-0 border border-white/60">
                              <img 
                                src={cat.image || fallbackImg} 
                                alt={cat.name} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <div>
                              <div className="font-bold text-[hsl(353,20%,15%)]">{cat.name}</div>
                              <div className="text-[10px] font-mono text-gray-400 mt-0.5">/{cat.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            cat.type === 'sub' 
                              ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                              : 'bg-[hsl(353,45%,96%)] text-[hsl(353,45%,35%)] border border-[hsl(353,45%,90%)]'
                          }`}>
                            {cat.type === 'sub' ? 'Sub' : 'Primary'}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500 font-medium">
                          {cat.parentCategory ? (
                            <span className="flex items-center gap-1.5 text-xs">
                              <Layers size={13} className="text-gray-400" />
                              {categories.find(c => c._id === cat.parentCategory)?.name || 'Parent Category'}
                            </span>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                        <td className="p-4 text-center text-lg">
                          {cat.icon || '✨'}
                        </td>
                        <td className="p-4 text-gray-500 max-w-[200px] truncate" title={cat.description}>
                          {cat.description || <span className="text-gray-300 italic">No description</span>}
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <button 
                            onClick={() => handleDelete(cat._id, cat.name)}
                            disabled={loading}
                            className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 opacity-80 group-hover:opacity-100 disabled:opacity-50"
                            title="Delete Category"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="p-10 text-center text-gray-400 italic">
                      No categories created yet. Use the form above to add your first wedding category!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
