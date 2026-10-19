'use client';

import React, { useState, useEffect } from 'react';
import { Product, ProductType } from '@/lib/types';
import { DEFAULT_PRODUCT_CATEGORIES } from '@/lib/products-data';
import { slugify } from '@/lib/utils';
import { X, Sparkles, Image as ImageIcon, Save, Check } from 'lucide-react';

interface AdminProductModalProps {
  product: Product | null; // null means create new
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id'> | Product) => Promise<void>;
  categories?: string[];
}

export const AdminProductModal: React.FC<AdminProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave,
  categories = []
}) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState<number>(100000);
  const [category, setCategory] = useState('E-Book & Panduan Praktis');
  const [productType, setProductType] = useState<ProductType>('digital');
  const [imageUrl, setImageUrl] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [fileSpec, setFileSpec] = useState('');
  const [stock, setStock] = useState<number>(9999);
  const [description, setDescription] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setSlug(product.slug);
      setPrice(product.price);
      setCategory(product.category);
      setProductType(product.product_type);
      setImageUrl(product.image_url);
      setDownloadUrl(product.download_url || '');
      setFileSpec(product.file_spec || '');
      setStock(product.stock);
      setDescription(product.description);
      setFeaturesText(product.features?.join('\n') || '');
    } else {
      // Default new product values
      setTitle('');
      setSlug('');
      setPrice(150000);
      setCategory('E-Book & Panduan Praktis');
      setProductType('digital');
      setImageUrl('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80');
      setDownloadUrl('');
      setFileSpec('');
      setStock(9999);
      setDescription('');
      setFeaturesText('');
    }
  }, [product, isOpen]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!product) {
      setSlug(slugify(val));
    }
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    const matched = DEFAULT_PRODUCT_CATEGORIES.find((dc) => dc.name === val);
    if (matched) {
      setProductType(matched.type);
      if (matched.type === 'digital' && stock < 9999 && !product) {
        setStock(9999);
      } else if (matched.type === 'physical' && stock === 9999) {
        setStock(25);
      }
    } else if (val === 'Digital Lainnya') {
      setProductType('digital');
      if (stock < 9999 && !product) setStock(9999);
    } else if (val === 'Fisik Lainnya') {
      setProductType('physical');
      if (stock === 9999) setStock(25);
    }
  };

  const handleTypeChange = (type: ProductType) => {
    setProductType(type);
    if (type === 'digital') {
      if (stock < 9999 && !product) setStock(9999);
      const isCurrentlyPhysical =
        category === 'Pakaian Nyaman (Fashion)' ||
        category === 'Aksesoris & Kebutuhan Harian' ||
        category === 'Fisik Lainnya';
      if (!category || isCurrentlyPhysical) {
        setCategory('E-Book & Panduan Praktis');
      }
    } else {
      if (stock === 9999) setStock(25);
      const isCurrentlyDigital =
        category === 'E-Book & Panduan Praktis' ||
        category === 'Template & Aset Digital' ||
        category === 'Digital Lainnya';
      if (!category || isCurrentlyDigital) {
        setCategory('Pakaian Nyaman (Fashion)');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const features = featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const dataPayload = {
      title,
      slug: slug || slugify(title),
      price: Number(price),
      category,
      product_type: productType,
      image_url: imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      download_url: productType === 'digital' ? downloadUrl : undefined,
      file_spec: fileSpec,
      stock: productType === 'digital' ? 9999 : Number(stock),
      rating: product?.rating || 5.0,
      sales_count: product?.sales_count || 0,
      description,
      features
    };

    if (product) {
      await onSave({ ...dataPayload, id: product.id });
    } else {
      await onSave(dataPayload);
    }

    setIsSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <h3 className="font-bold text-zinc-900 dark:text-white text-lg">
              {product ? 'Edit Produk' : 'Tambah Produk Baru'}
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
            {/* Product Type Choice */}
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Tipe Produk *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleTypeChange('digital')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${
                    productType === 'digital'
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-bold ring-2 ring-emerald-500/20'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className="text-sm">⚡ Produk Digital</span>
                  <span className="text-[10px] text-zinc-500">E-Book & Panduan Praktis, Template & Aset Digital</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTypeChange('physical')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${
                    productType === 'physical'
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-bold ring-2 ring-blue-500/20'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className="text-sm">📦 Produk Fisik</span>
                  <span className="text-[10px] text-zinc-500">Pakaian Nyaman (Fashion), Aksesoris & Kebutuhan Harian</span>
                </button>
              </div>
            </div>

            {/* Title & Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Nama / Judul Produk *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Misal: Figma UI Kit Pro"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Slug URL
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="figma-ui-kit-pro"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Category & Price & Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                    Kategori *
                  </label>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      productType === 'digital'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                        : 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {productType === 'digital' ? '⚡ Digital' : '📦 Fisik'}
                  </span>
                </div>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                >
                  <optgroup label="⚡ Produk Digital">
                    <option value="E-Book & Panduan Praktis">E-Book & Panduan Praktis</option>
                    <option value="Template & Aset Digital">Template & Aset Digital</option>
                    <option value="Digital Lainnya">Digital Lainnya</option>
                  </optgroup>
                  <optgroup label="📦 Produk Fisik">
                    <option value="Pakaian Nyaman (Fashion)">Pakaian Nyaman (Fashion)</option>
                    <option value="Aksesoris & Kebutuhan Harian">Aksesoris & Kebutuhan Harian</option>
                    <option value="Fisik Lainnya">Fisik Lainnya</option>
                  </optgroup>
                  {categories.filter(
                    (c) =>
                      ![
                        'E-Book & Panduan Praktis',
                        'Template & Aset Digital',
                        'Digital Lainnya',
                        'Pakaian Nyaman (Fashion)',
                        'Aksesoris & Kebutuhan Harian',
                        'Fisik Lainnya'
                      ].includes(c)
                  ).length > 0 && (
                    <optgroup label="Kategori Tersedia Lainnya">
                      {categories
                        .filter(
                          (c) =>
                            ![
                              'E-Book & Panduan Praktis',
                              'Template & Aset Digital',
                              'Digital Lainnya',
                              'Pakaian Nyaman (Fashion)',
                              'Aksesoris & Kebutuhan Harian',
                              'Fisik Lainnya'
                            ].includes(c)
                        )
                        .map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                    </optgroup>
                  )}
                </select>
                <p className="text-[10px] text-zinc-400 mt-1">
                  * Kategori otomatis menyinkronkan tipe digital / fisik
                </p>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Harga (IDR) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  {productType === 'digital' ? 'Stok (Tak Terbatas)' : 'Jumlah Stok Fisik *'}
                </label>
                <input
                  type="number"
                  min="0"
                  disabled={productType === 'digital'}
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                URL Gambar Produk *
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-[11px]"
                />
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-9 h-9 object-cover rounded-lg border border-zinc-200 dark:border-zinc-700 shrink-0"
                  />
                )}
              </div>
            </div>

            {/* If Digital: Download URL */}
            {productType === 'digital' && (
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Link Download File / Akses Pembeli *
                </label>
                <input
                  type="text"
                  required
                  value={downloadUrl}
                  onChange={(e) => setDownloadUrl(e.target.value)}
                  placeholder="Misal: Link Google Drive, Dropbox, atau GitHub repo"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-[11px]"
                />
              </div>
            )}

            {/* File Spec / Physical Specs */}
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                {productType === 'digital' ? 'Format & Spesifikasi File' : 'Spesifikasi Dimensi & Berat'}
              </label>
              <input
                type="text"
                value={fileSpec}
                onChange={(e) => setFileSpec(e.target.value)}
                placeholder={
                  productType === 'digital'
                    ? 'Format PDF • 320 Halaman • Full Color'
                    : 'Berat: 950g • Dimensi: 316 x 130mm • Garansi 1 Tahun'
                }
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Deskripsi Produk
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan keunggulan dan detail produk..."
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Features (one per line) */}
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Poin Keunggulan / Fitur (1 baris per poin)
              </label>
              <textarea
                rows={3}
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder="Fitur 1&#10;Fitur 2&#10;Fitur 3"
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-[11px]"
              />
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition disabled:opacity-50"
              >
                {isSaving ? (
                  <span>Menyimpan...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{product ? 'Simpan Perubahan' : 'Tambah Produk'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
