'use client';

import React from 'react';
import Link from 'next/link';
import { Layers, ShieldCheck, Truck, Zap, Heart, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-900 text-zinc-300 border-t border-zinc-800 mt-auto">
      {/* Value Proposition Highlights */}
      <div className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-800/40">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Unduhan Instan Digital</h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Akses link download file, lisensi, dan e-book langsung detik ini juga setelah pembayaran.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-800/40">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Pengiriman Produk Fisik Aman</h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Packing aman dengan bubble wrap tebal, nomor resi otomatis, dan jaminan produk original.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-800/40">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Harga Jual Terjangkau</h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Nikmati berbagai produk pilihan dengan harga terbaik dan terjangkau
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Layers className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-base">
              Fadhil<span className="text-indigo-400">Store</span>
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Platform katalog dan e-commerce modern terpercaya di Indonesia yang menyediakan koleksi e-book bermanfaat, pakaian sehari-hari berkualitas, serta berbagai produk fisik dan digital pilihan.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Kategori Produk</h4>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li><Link href="/?category=digital" className="hover:text-white transition">E-Book & Panduan Praktis</Link></li>
            <li><Link href="/?category=digital" className="hover:text-white transition">Template & Aset Digital</Link></li>
            <li><Link href="/?category=physical" className="hover:text-white transition">Pakaian Nyaman (Fashion)</Link></li>
            <li><Link href="/?category=physical" className="hover:text-white transition">Aksesoris & Kebutuhan Harian</Link></li>
            <li><Link href="/" className="hover:text-white transition">Lainnya</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Akses & Bantuan</h4>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li><Link href="/orders" className="hover:text-white transition">Lacak & Riwayat Pesanan</Link></li>
            <li><Link href="/cart" className="hover:text-white transition">Keranjang Belanja</Link></li>
            <li><Link href="/admin/login" className="hover:text-amber-300 text-zinc-300 transition font-medium">Portal Administrator 🔒</Link></li>
            <li><Link href="/login" className="hover:text-white transition">Masuk Akun Pelanggan</Link></li>
            <li><Link href="/register" className="hover:text-white transition">Daftar Akun Baru</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Kontak & Dukungan</h4>
          <ul className="space-y-2.5 text-xs text-zinc-400">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>support@fadhilstore.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>+62 812-3456-7890</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Banda Aceh, Aceh, Indonesia</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-800 py-6 text-center text-xs text-zinc-500">
        <p>© 2026 FadhilStore. Hak Cipta Dilindungi Undang-Undang.</p>
      </div>
    </footer>
  );
};
