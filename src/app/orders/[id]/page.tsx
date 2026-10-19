'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchOrderById } from '@/lib/supabase';
import { Order } from '@/lib/types';
import { formatIDR, formatDate, getStatusBadgeClass } from '@/lib/utils';
import {
  CheckCircle2,
  Download,
  Package,
  Calendar,
  CreditCard,
  User,
  MapPin,
  ExternalLink,
  ChevronLeft,
  Printer,
  Sparkles,
  Truck
} from 'lucide-react';

function OrderDetailContent() {
  const params = useParams();
  const rawId = params?.id;
  const orderId = typeof rawId === 'string' ? decodeURIComponent(rawId).trim() : (Array.isArray(rawId) ? decodeURIComponent(rawId[0]).trim() : '');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const data = await fetchOrderById(orderId);
      setOrder(data);
      setIsLoading(false);
    }
    loadOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 animate-pulse space-y-4">
        <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded mx-auto" />
        <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded-3xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          Pesanan Tidak Ditemukan
        </h2>
        <p className="text-zinc-500 text-xs mt-2">
          ID Pesanan <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded font-mono">{orderId || '-'}</code> belum tercatat atau tidak dapat diakses.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition"
          >
            Kembali ke Katalog
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition"
          >
            Muat Ulang Halaman
          </button>
          <Link
            href="/orders"
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition"
          >
            Lihat Riwayat Pesanan
          </Link>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-4 mb-6 text-xs text-zinc-500 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali ke Katalog
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/orders"
            className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium transition"
          >
            Semua Pesanan Saya
          </Link>
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 font-medium transition flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Invoice</span>
          </button>
        </div>
      </div>

      {/* Invoice Card Container */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xl overflow-hidden p-6 sm:p-10 space-y-8">
        {/* Success Header */}
        <div className="text-center pb-6 border-b border-zinc-100 dark:border-zinc-800 space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
            Pesanan Berhasil Disimpan!
          </h1>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            Transaksi Anda telah berhasil dicatat ke database Supabase. Simpan Invoice ID ini sebagai bukti pemesanan yang sah.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <span className="font-mono text-xs font-bold px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-800 dark:text-zinc-200">
              ID: {order.id}
            </span>
            <span className={`text-xs font-semibold px-3 py-1 rounded-lg ${getStatusBadgeClass(order.status)}`}>
              Status: {order.status}
            </span>
          </div>
        </div>

        {/* Info Columns: Buyer, Payment, Order Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div className="space-y-1">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-bold block">
              Penerima / Pembeli
            </span>
            <p className="font-bold text-zinc-900 dark:text-white text-sm">{order.customer_name}</p>
            <p className="text-zinc-500">{order.customer_email}</p>
            <p className="text-zinc-500">{order.customer_phone}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-bold block">
              Metode Pembayaran
            </span>
            <p className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-indigo-500" />
              <span>{order.payment_method}</span>
            </p>
            <p className="text-zinc-500 text-[11px]">
              Tanggal: {formatDate(order.created_at)}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-bold block">
              Alamat Pengiriman Fisik
            </span>
            {order.shipping_address ? (
              <div className="text-zinc-600 dark:text-zinc-300">
                <p className="line-clamp-2">{order.shipping_address}</p>
                <p className="text-[11px] text-zinc-400">
                  {order.shipping_city} {order.shipping_postal_code}
                </p>
              </div>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold block">
                ⚡ Hanya Produk Digital (Tanpa Alamat Fisik)
              </span>
            )}
          </div>
        </div>

        {/* Purchased Items List */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-800">
            Daftar Produk yang Dipesan
          </h3>

          <div className="space-y-3">
            {order.items?.map((item, idx) => {
              const isDigital = item.product_type === 'digital';

              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-700">
                      {isDigital ? (
                        <Download className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Package className="w-5 h-5 text-blue-500" />
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white">
                        {item.product_title}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-500">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          {formatIDR(item.price)}
                        </span>
                        <span>• Jumlah: {item.quantity}</span>
                        <span className="capitalize">({item.product_type})</span>
                      </div>
                    </div>
                  </div>

                  {/* If Digital: Instant Access Button */}
                  {isDigital ? (
                    <a
                      href={item.download_url || 'https://drive.google.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                    >
                      <Download className="w-4 h-4" />
                      <span>Unduh Berkas Digital</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50">
                      <Truck className="w-4 h-4" />
                      <span>Diproses Tim Gudang</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Total Summary */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-zinc-500">
            {order.notes && (
              <p>
                <b className="text-zinc-700 dark:text-zinc-300">Catatan Pemesan:</b> {order.notes}
              </p>
            )}
          </div>

          <div className="flex items-baseline gap-4 self-end sm:self-auto">
            <span className="text-xs text-zinc-500 font-medium">Total Nilai Transaksi:</span>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {formatIDR(order.total_amount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <React.Suspense fallback={<div className="max-w-3xl mx-auto py-20 text-center text-xs text-zinc-500">Memuat rincian pesanan...</div>}>
      <OrderDetailContent />
    </React.Suspense>
  );
}
