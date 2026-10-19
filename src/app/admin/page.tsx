'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  fetchOrders,
  fetchProducts,
  updateOrderStatus,
  createProduct,
  updateProduct,
  deleteProduct,
  isSupabaseConfigured
} from '@/lib/supabase';
import { Order, Product, OrderStatus } from '@/lib/types';
import { formatIDR, formatDate, getStatusBadgeClass } from '@/lib/utils';
import { AdminProductModal } from '@/components/AdminProductModal';
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  TrendingUp,
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  Download,
  Truck,
  ExternalLink,
  CheckCircle2,
  Clock,
  Layers,
  Database,
  Lock,
  ChevronLeft,
  Filter
} from 'lucide-react';

export default function AdminPage() {
  const { user, isAdmin } = useAuth();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'supabase'>('orders');

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [productTypeFilter, setProductTypeFilter] = useState<'all' | 'digital' | 'physical'>('all');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');

  // Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [allOrders, allProducts] = await Promise.all([
        fetchOrders(),
        fetchProducts()
      ]);
      setOrders(allOrders);
      setProducts(allProducts);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update order status handler
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      showToast(`Status pesanan ${orderId} diubah menjadi "${newStatus}"`);
    }
  };

  // Save product (create or update)
  const handleSaveProduct = async (productData: Omit<Product, 'id'> | Product) => {
    try {
      if ('id' in productData && productData.id) {
        const updated = await updateProduct(productData.id, productData);
        if (updated) {
          setProducts((prev) =>
            prev.map((p) => (p.id === updated.id ? updated : p))
          );
          showToast(`✅ Produk "${updated.title}" berhasil diperbarui di database!`);
        }
      } else {
        const created = await createProduct(productData as Omit<Product, 'id'>);
        setProducts((prev) => [created, ...prev]);
        showToast(`✅ Produk baru "${created.title}" berhasil disimpan permanen ke Supabase!`);
      }
    } catch (err: any) {
      console.error(err);
      alert(`⚠️ GAGAL MENYIMPAN KE SUPABASE:\n\n${err.message}\n\nSilakan periksa RLS Policy di Supabase Anda agar mengizinkan INSERT ke tabel 'products'.`);
      showToast(`❌ Gagal simpan: ${err.message}`);
    }
  };

  // Delete product handler
  const handleDeleteProduct = async (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus produk "${title}"?`)) {
      try {
        await deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showToast(`✅ Produk "${title}" berhasil dihapus dari database!`);
      } catch (err: any) {
        console.error(err);
        alert(`⚠️ Gagal menghapus dari Supabase:\n\n${err.message}`);
        showToast(`❌ Gagal hapus: ${err.message}`);
      }
    }
  };

  // Metrics calculations
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'Dibatalkan' ? sum + o.total_amount : sum), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Menunggu Pembayaran').length;
  const processingOrders = orders.filter((o) => o.status === 'Diproses').length;
  const completedOrders = orders.filter((o) => o.status === 'Selesai').length;

  // Filtered orders
  const filteredOrders = orders.filter((ord) => {
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const matchId = ord.id.toLowerCase().includes(q);
      const matchName = ord.customer_name.toLowerCase().includes(q);
      const matchEmail = ord.customer_email.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchEmail) return false;
    }
    if (orderStatusFilter !== 'all' && ord.status !== orderStatusFilter) {
      return false;
    }
    return true;
  });

  // Unique categories list for admin
  const adminAvailableCategories = useMemo(() => {
    const defaultList = [
      'E-Book & Panduan Praktis',
      'Template & Aset Digital',
      'Pakaian Nyaman (Fashion)',
      'Aksesoris & Kebutuhan Harian'
    ];
    const fromProducts = Array.from(new Set(products.map((p) => p.category)));
    fromProducts.forEach((cat) => {
      if (!defaultList.includes(cat)) {
        defaultList.push(cat);
      }
    });
    return defaultList;
  }, [products]);

  // Filtered products
  const filteredProducts = products.filter((prod) => {
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      const matchTitle = prod.title.toLowerCase().includes(q);
      const matchCat = prod.category.toLowerCase().includes(q);
      if (!matchTitle && !matchCat) return false;
    }
    if (productTypeFilter !== 'all' && prod.product_type !== productTypeFilter) {
      return false;
    }
    if (productCategoryFilter !== 'all' && prod.category !== productCategoryFilter) {
      return false;
    }
    return true;
  });

  // Access check
  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          Akses Khusus Administrator
        </h2>
        <p className="text-xs text-zinc-500 mt-2 mb-6">
          Halaman ini khusus untuk admin toko FadhilStore untuk mengelola inventaris produk dan pesanan pembeli.
        </p>
        <div className="space-y-3">
          <Link
            href="/login?redirect=/admin"
            className="block w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md"
          >
            Masuk sebagai Administrator
          </Link>
          <Link
            href="/"
            className="block w-full py-2.5 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition"
          >
            Kembali ke Katalog Produk
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-bold shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-600 text-white">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              Dashboard Admin
            </h1>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Kelola pesanan masuk, pantau status pembayaran, dan perbarui katalog produk digital & fisik
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsProductModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk Baru</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 text-xs mb-2">
            <span>Total Pendapatan</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-black text-zinc-900 dark:text-white">
            {formatIDR(totalRevenue)}
          </p>
          <span className="text-[10px] text-zinc-400 mt-1 block">Dari {orders.length} transaksi</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 text-xs mb-2">
            <span>Menunggu Pembayaran</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-black text-amber-600 dark:text-amber-400">
            {pendingOrders} Pesanan
          </p>
          <span className="text-[10px] text-zinc-400 mt-1 block">Perlu konfirmasi/pelunasan</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 text-xs mb-2">
            <span>Sedang Diproses</span>
            <Truck className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-black text-blue-600 dark:text-blue-400">
            {processingOrders} Pesanan
          </p>
          <span className="text-[10px] text-zinc-400 mt-1 block">Pengiriman fisik & verifikasi</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 text-xs mb-2">
            <span>Total Produk Aktif</span>
            <Layers className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xl font-black text-purple-600 dark:text-purple-400">
            {products.length} Item
          </p>
          <span className="text-[10px] text-zinc-400 mt-1 block">
            {products.filter((p) => p.product_type === 'digital').length} Digital •{' '}
            {products.filter((p) => p.product_type === 'physical').length} Fisik
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 mb-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'orders'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Pesanan Masuk ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'products'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Katalog Produk ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('supabase')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'supabase'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Status Supabase & Skema SQL</span>
        </button>
      </div>

      {/* TAB 1: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Cari ID pesanan, nama pemesan, email..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-medium">Filter Status:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-semibold"
              >
                <option value="all">Semua Status</option>
                <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
                <option value="Diproses">Diproses</option>
                <option value="Selesai">Selesai</option>
                <option value="Dibatalkan">Dibatalkan</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm overflow-hidden">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center text-xs text-zinc-500">
                Tidak ada pesanan yang sesuai dengan filter pencarian.
              </div>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredOrders.map((ord) => {
                  const isExpanded = expandedOrderId === ord.id;

                  return (
                    <div key={ord.id} className="p-4 sm:p-5 transition hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Order ID & Customer */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-zinc-900 dark:text-white">
                              {ord.id}
                            </span>
                            <span className="text-[10px] text-zinc-400">
                              • {formatDate(ord.created_at)}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 uppercase">
                              {ord.order_type}
                            </span>
                          </div>

                          <div className="text-xs">
                            <span className="font-bold text-zinc-900 dark:text-white">
                              {ord.customer_name}
                            </span>{' '}
                            <span className="text-zinc-400">({ord.customer_email} • {ord.customer_phone})</span>
                          </div>
                        </div>

                        {/* Total & Status Selector */}
                        <div className="flex flex-wrap items-center gap-4">
                          <div>
                            <span className="text-[10px] text-zinc-400 block lg:text-right">Total Nilai</span>
                            <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                              {formatIDR(ord.total_amount)}
                            </span>
                          </div>

                          {/* Quick Status Updater */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-zinc-400 hidden sm:inline">Status:</span>
                            <select
                              value={ord.status}
                              onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                              className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${getStatusBadgeClass(
                                ord.status
                              )}`}
                            >
                              <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
                              <option value="Diproses">Diproses</option>
                              <option value="Selesai">Selesai</option>
                              <option value="Dibatalkan">Dibatalkan</option>
                            </select>
                          </div>

                          {/* Expand Button */}
                          <button
                            onClick={() => setExpandedOrderId(isExpanded ? null : ord.id)}
                            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                            title="Rincian Item"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Order Items and Shipping details */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs space-y-3 bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-2xl">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <p className="font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                                Info Pembayaran & Pengiriman:
                              </p>
                              <p className="text-zinc-500">
                                <b>Metode:</b> {ord.payment_method}
                              </p>
                              {ord.shipping_address ? (
                                <p className="text-zinc-500 mt-1">
                                  <b>Alamat Pengiriman:</b> {ord.shipping_address}, {ord.shipping_city}{' '}
                                  {ord.shipping_postal_code}
                                </p>
                              ) : (
                                <p className="text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                                  ⚡ Pesanan Digital (Akses Unduhan Otomatis)
                                </p>
                              )}
                              {ord.notes && (
                                <p className="text-zinc-500 mt-1">
                                  <b>Catatan:</b> {ord.notes}
                                </p>
                              )}
                            </div>

                            <div>
                              <p className="font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                                Rincian Produk ({ord.items?.length || 0}):
                              </p>
                              <ul className="space-y-1.5">
                                {ord.items?.map((it, idx) => (
                                  <li key={idx} className="flex items-center justify-between text-zinc-600 dark:text-zinc-300">
                                    <span>
                                      {it.quantity}x {it.product_title} ({it.product_type})
                                    </span>
                                    <span className="font-bold">{formatIDR(it.price * it.quantity)}</span>
                                  </li>
                                ))}
                              </ul>
                              <div className="mt-3">
                                <Link
                                  href={`/orders/${ord.id}`}
                                  target="_blank"
                                  className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                                >
                                  <span>Buka Invoice Publik</span>
                                  <ExternalLink className="w-3 h-3" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT MANAGEMENT CRUD */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Cari produk katalog..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-400 font-medium">Tipe:</span>
                <select
                  value={productTypeFilter}
                  onChange={(e) => setProductTypeFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs font-semibold focus:outline-none"
                >
                  <option value="all">Semua Tipe</option>
                  <option value="digital">Hanya Digital</option>
                  <option value="physical">Hanya Fisik</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-400 font-medium">Kategori:</span>
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs font-semibold focus:outline-none"
                >
                  <option value="all">Semua Kategori</option>
                  {adminAvailableCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm overflow-hidden">
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredProducts.map((p) => {
                const isDigital = p.product_type === 'digital';

                return (
                  <div
                    key={p.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={p.image_url}
                        alt={p.title}
                        className="w-14 h-14 object-cover rounded-xl bg-zinc-100 shrink-0 border border-zinc-200 dark:border-zinc-700"
                      />

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          {isDigital ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              ⚡ Digital
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                              📦 Fisik
                            </span>
                          )}
                          <span className="text-[10px] text-zinc-400">{p.category}</span>
                        </div>

                        <h4 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white truncate">
                          {p.title}
                        </h4>

                        <p className="text-[11px] text-zinc-500">
                          {formatIDR(p.price)} • {isDigital ? 'Stok: Tak Terbatas' : `Stok: ${p.stock} unit`} • {p.sales_count} Terjual
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        onClick={() => {
                          setEditingProduct(p);
                          setIsProductModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1 transition"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(p.id, p.title)}
                        className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold flex items-center gap-1 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SUPABASE STATUS & CONFIGURATION */}
      {activeTab === 'supabase' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                    Status Koneksi Supabase Database
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Konfigurasi Environment Variable & Row Level Security
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 dark:bg-zinc-800">
                <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured() ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span>{isSupabaseConfigured() ? 'Supabase Aktif' : 'Penyimpanan Lokal'}</span>
              </div>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Aplikasi ini terhubung langsung ke Supabase Auth, tabel <code>products</code>, <code>orders</code>, dan <code>order_items</code>. Seluruh data disimpan dan disinkronkan secara aman.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <h4 className="font-bold text-zinc-900 dark:text-white">
                Langkah Cepat Menghubungkan Supabase:
              </h4>
              <ol className="list-decimal pl-4 space-y-2 text-zinc-600 dark:text-zinc-400">
                <li>
                  Buka dashboard Supabase Anda di{' '}
                  <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">
                    supabase.com
                  </a>{' '}
                  dan buat project baru.
                </li>
                <li>
                  Salin isi berkas <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded font-mono">supabase-schema.sql</code> di root proyek ini, lalu tempelkan ke <b>SQL Editor</b> di Supabase dan klik <b>Run</b>.
                </li>
                <li>
                  Buka menu <b>Project Settings &gt; API</b> di Supabase, lalu salin <b>Project URL</b> dan <b>anon public key</b>.
                </li>
                <li>
                  Masukkan ke dalam berkas <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded font-mono">.env.local</code>:
                  <pre className="mt-2 p-3 rounded-xl bg-zinc-950 text-emerald-400 font-mono text-[11px] overflow-x-auto">
                    NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co{'\n'}
                    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
                  </pre>
                </li>
                <li>
                  Restart dev server (<code>npm run dev</code>). Semua tabel langsung aktif dengan Row Level Security!
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Admin Product Modal */}
      <AdminProductModal
        product={editingProduct}
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        categories={adminAvailableCategories}
      />
    </div>
  );
}
