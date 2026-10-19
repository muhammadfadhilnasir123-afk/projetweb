'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  ShoppingBag,
  ShieldCheck,
  User,
  LogOut,
  Package,
  Layers,
  ChevronDown,
  Menu,
  X,
  ExternalLink,
  Laptop,
  CheckCircle2
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { totalItems, setIsCartDrawerOpen } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-zinc-950/90 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-zinc-200">
              Katalog Produk Digital & Fisik Indonesia
            </span>
            <span className="hidden md:inline text-zinc-400">• Pengiriman Cepat & Unduhan Instan</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-[11px] text-zinc-300 hover:text-white transition"
            >
              FadhilStore Official
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-zinc-900 dark:text-white tracking-tight leading-none">
                  Fadhil<span className="text-indigo-600 dark:text-indigo-400">Store</span>
                </span>
                <span className="text-[10px] text-zinc-500 tracking-wider uppercase font-medium">
                  Digital & Physical Hub
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300">
              <Link
                href="/"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                Semua Produk
              </Link>
              <Link
                href="/?category=digital"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 transition"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Produk Digital
              </Link>
              <Link
                href="/?category=physical"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 transition"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Produk Fisik
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Panel
                </Link>
              )}
            </nav>
          </div>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2.5 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              aria-label="Buka Keranjang"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-scale shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Account Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-semibold text-xs">
                    {user.full_name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-200 max-w-[100px] truncate hidden sm:inline">
                    {user.full_name || user.email}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-2 z-50 text-sm animate-in fade-in zoom-in-95"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <p className="text-xs font-medium text-zinc-900 dark:text-white truncate">
                        {user.full_name}
                      </p>
                      <p className="text-[11px] text-zinc-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                        {user.role === 'admin' ? 'Administrator' : 'Customer'}
                      </span>
                    </div>

                    <div className="py-1">
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-zinc-800 transition"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          Kelola Pesanan & Produk
                        </Link>
                      )}
                      <Link
                        href="/orders"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                      >
                        <Package className="w-4 h-4" />
                        Riwayat Pesanan Saya
                      </Link>
                      <Link
                        href="/cart"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Keranjang Belanja ({totalItems})
                      </Link>
                    </div>

                    <div className="border-t border-zinc-100 dark:border-zinc-800 pt-1">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Keluar (Logout)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition"
                >
                  Daftar
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
              aria-label="Buka Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Semua Produk
          </Link>
          <Link
            href="/?category=digital"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Produk Digital (Download Instan)
          </Link>
          <Link
            href="/?category=physical"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Produk Fisik (Dikirim ke Alamat)
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50"
            >
              Panel Admin
            </Link>
          )}
          <Link
            href="/cart"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Keranjang ({totalItems})
          </Link>
          {user && (
            <Link
              href="/orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Pesanan Saya
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
