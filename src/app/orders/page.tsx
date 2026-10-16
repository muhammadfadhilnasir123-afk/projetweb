'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { fetchUserOrders } from '@/lib/supabase';
import { Order } from '@/lib/types';
import { formatIDR, formatDate, getStatusBadgeClass } from '@/lib/utils';
import {
  Package,
  Calendar,
  CreditCard,
  ArrowRight,
  ShoppingBag,
  Download,
  Lock,
  ChevronLeft
} from 'lucide-react';

export default function MyOrdersPage() {
  const { user, isLoading: authLoading, loginAsDemo } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      if (!user) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const userOrders = await fetchUserOrders(user.email, user.id);
      setOrders(userOrders);
      setIsLoading(false);
    }
    loadOrders();
  }, [user]);

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse space-y-4">
        <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded mx-auto" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          Silakan Masuk untuk Melihat Pesanan
        </h2>
        <p className="text-xs text-zinc-500 mt-1 mb-6">
          Riwayat transaksi Anda tersimpan aman dan terproteksi di database Supabase.
        </p>
        <div className="space-y-3">
          <Link
            href="/login?redirect=/orders"
            className="block w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md"
          >
            Masuk ke Akun
          </Link>
          <button
            onClick={() => loginAsDemo('customer')}
            className="w-full py-2.5 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition"
          >
            Gunakan Akun Demo Pembeli
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Riwayat Pesanan Saya
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Daftar seluruh transaksi produk digital & fisik atas nama <b>{user.email}</b>
          </p>
        </div>

        <Link
          href="/"
          className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1 self-start sm:self-auto"
        >
          <ChevronLeft className="w-4 h-4" />
          Katalog Produk
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-zinc-200 dark:bg-zinc-800/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80">
          <Package className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
          <h3 className="font-bold text-base text-zinc-800 dark:text-zinc-200">
            Belum Ada Transaksi
          </h3>
          <p className="text-xs text-zinc-500 mt-1 mb-6">
            Anda belum pernah melakukan pemesanan produk di toko kami.
          </p>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm"
          >
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm hover:border-indigo-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-zinc-900 dark:text-white">
                    {ord.id}
                  </span>
                  <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${getStatusBadgeClass(ord.status)}`}>
                    {ord.status}
                  </span>
                  <span className="text-[11px] text-zinc-400 capitalize">
                    • Tipe: {ord.order_type}
                  </span>
                </div>

                <div className="text-xs text-zinc-500 space-y-0.5">
                  <p className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{formatDate(ord.created_at)}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{ord.payment_method}</span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {ord.items?.map((it, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium"
                    >
                      {it.quantity}x {it.product_title}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-zinc-400 block">Total Transaksi</span>
                  <span className="text-base font-black text-indigo-600 dark:text-indigo-400">
                    {formatIDR(ord.total_amount)}
                  </span>
                </div>

                <Link
                  href={`/orders/${ord.id}`}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold flex items-center gap-1.5 transition shadow-sm shrink-0"
                >
                  <span>Lihat Faktur & Download</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
