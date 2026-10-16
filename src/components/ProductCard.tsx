'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { formatIDR } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import {
  ShoppingBag,
  Download,
  Package,
  Star,
  Check,
  Eye,
  FileCode2
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const isDigital = product.product_type === 'digital';
  const isOutOfStock = !isDigital && product.stock <= 0;

  return (
    <div className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-500/30 transition-all duration-300">
      {/* Product Image & Badges */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img
          src={product.image_url}
          alt={product.title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Product Type Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isDigital ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/90 text-white backdrop-blur-md shadow-sm">
              <Download className="w-3 h-3" />
              Digital
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-600/90 text-white backdrop-blur-md shadow-sm">
              <Package className="w-3 h-3" />
              Fisik
            </span>
          )}
        </div>

        {/* Category Pill */}
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-black/60 text-white backdrop-blur-md">
            {product.category}
          </span>
        </div>

        {/* Quick View Button on Hover */}
        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] z-10"
            title="Lihat Detail Cepat"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-zinc-900 text-xs font-semibold shadow-lg hover:scale-105 transition-transform">
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
              Detail Cepat
            </span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Rating and Sales */}
        <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
          <div className="flex items-center gap-1 text-amber-500 font-semibold">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{product.rating}</span>
          </div>
          <span>{product.sales_count}+ Terjual</span>
        </div>

        {/* Title */}
        <Link
          href={`/product/${product.id}`}
          className="font-bold text-zinc-900 dark:text-zinc-100 text-base leading-snug line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
        >
          {product.title}
        </Link>

        {/* File spec or Stock */}
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
          {product.file_spec || (isDigital ? 'Akses Instan' : `Tersedia ${product.stock} unit`)}
        </p>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] text-zinc-400 block leading-none">Harga</span>
            <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
              {formatIDR(product.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm ${
              isOutOfStock
                ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed dark:bg-zinc-800'
                : isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Masuk!</span>
              </>
            ) : isOutOfStock ? (
              <span>Habis</span>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Tambah</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
