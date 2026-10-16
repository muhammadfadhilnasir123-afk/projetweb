'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createOrder } from '@/lib/supabase';
import { formatIDR } from '@/lib/utils';
import { OrderItem } from '@/lib/types';
import {
  Lock,
  ShieldCheck,
  Truck,
  Download,
  CreditCard,
  QrCode,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ChevronLeft,
  Sparkles
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalItems, subtotal, clearCart, hasPhysicalItems, hasDigitalItems } = useCart();
  const { user, isLoading: authLoading, loginAsDemo } = useAuth();

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingPostalCode, setShippingPostalCode] = useState('');
  const [shippingCourier, setShippingCourier] = useState('JNE Reguler (Rp 18.000)');
  const [paymentMethod, setPaymentMethod] = useState('QRIS Instant (GoPay / OVO / BCA)');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Autofill user information if logged in
  useEffect(() => {
    if (user) {
      if (user.full_name) setCustomerName(user.full_name);
      if (user.email) setCustomerEmail(user.email);
    }
  }, [user]);

  // Shipping fee calculation
  const shippingFee = hasPhysicalItems ? 18000 : 0;
  const grandTotal = subtotal + shippingFee;

  // Protect page if not logged in
  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded mx-auto mb-4" />
        <div className="h-4 w-72 bg-zinc-200 dark:bg-zinc-800 rounded mx-auto" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Halaman Checkout Terproteksi
            </h2>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Untuk keamanan transaksi dan penyimpanan data ke Supabase, Anda wajib login sebelum menyelesaikan checkout.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/login?redirect=/checkout"
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition"
            >
              <span>Masuk ke Akun Anda</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => loginAsDemo('customer')}
              className="w-full py-2.5 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Gunakan Akun Demo Pembeli (Instan)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          Tidak Ada Item untuk di-Checkout
        </h2>
        <p className="text-xs text-zinc-500 mt-2">
          Keranjang belanja Anda kosong. Silakan pilih produk terlebih dahulu.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali Belanja
        </Link>
      </div>
    );
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // Determine order type
      let orderType: 'digital' | 'physical' | 'hybrid' = 'digital';
      if (hasDigitalItems && hasPhysicalItems) orderType = 'hybrid';
      else if (hasPhysicalItems) orderType = 'physical';

      const orderItems: OrderItem[] = items.map((it) => ({
        product_id: it.product.id,
        product_title: it.product.title,
        product_type: it.product.product_type,
        price: it.product.price,
        quantity: it.quantity,
        download_url: it.product.download_url
      }));

      const newOrder = await createOrder(
        {
          user_id: user.id,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          shipping_address: hasPhysicalItems ? shippingAddress : undefined,
          shipping_city: hasPhysicalItems ? shippingCity : undefined,
          shipping_postal_code: hasPhysicalItems ? shippingPostalCode : undefined,
          order_type: orderType,
          total_amount: grandTotal,
          status: 'Menunggu Pembayaran',
          payment_method: paymentMethod,
          notes: notes || undefined
        },
        orderItems
      );

      clearCart();
      router.push(`/orders/${newOrder.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memproses pesanan';
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 mb-2 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali ke Keranjang
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
          Checkout & Pembayaran
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Lengkapi data pemesan dan pilih metode pembayaran untuk menyimpan pesanan ke Supabase
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form: Buyer details & Shipping */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Customer Info */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                1
              </span>
              Informasi Pemesan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nama sesuai KTP/ID"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Email Aktif *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <span className="text-[10px] text-zinc-400 mt-1 block">
                  Link unduhan produk digital & invoice otomatis dikirim ke email ini.
                </span>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Nomor WhatsApp / HP *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Physical Shipping Address (Conditional) */}
          {hasPhysicalItems ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                    2
                  </span>
                  Alamat Pengiriman (Produk Fisik)
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  Diperlukan untuk produk fisik
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Alamat Lengkap & Patokan Rumah *
                  </label>
                  <textarea
                    rows={3}
                    required={hasPhysicalItems}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Kota / Kabupaten *
                    </label>
                    <input
                      type="text"
                      required={hasPhysicalItems}
                      value={shippingCity}
                      onChange={(e) => setShippingCity(e.target.value)}
                      placeholder="Misal: Jakarta Selatan, Bandung, Surabaya"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Kode Pos *
                    </label>
                    <input
                      type="text"
                      required={hasPhysicalItems}
                      value={shippingPostalCode}
                      onChange={(e) => setShippingPostalCode(e.target.value)}
                      placeholder="12345"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Opsi Ekspedisi Pengiriman
                  </label>
                  <select
                    value={shippingCourier}
                    onChange={(e) => setShippingCourier(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                  >
                    <option value="JNE Reguler (Rp 18.000)">JNE Reguler - Estimasi 2-3 Hari (Rp 18.000)</option>
                    <option value="SiCepat BEST (Rp 22.000)">SiCepat BEST - Estimasi 1-2 Hari (Rp 22.000)</option>
                    <option value="J&T Express (Rp 18.000)">J&T Express - Estimasi 2-3 Hari (Rp 18.000)</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300">
              <Download className="w-5 h-5 shrink-0 text-emerald-600" />
              <div>
                <p className="font-bold">Semua Item dalam Keranjang adalah Produk Digital</p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                  Anda tidak perlu mengisi alamat pengiriman fisik. Berkas digital dapat diunduh langsung dari faktur setelah pemesanan.
                </p>
              </div>
            </div>
          )}

          {/* Section 3: Payment Method */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                {hasPhysicalItems ? '3' : '2'}
              </span>
              Pilih Metode Pembayaran
            </h3>

            <div className="space-y-3 text-xs">
              {[
                {
                  id: 'qris',
                  label: 'QRIS Instant (GoPay, OVO, ShopeePay, DANA, BCA)',
                  icon: QrCode,
                  desc: 'Scan barcode instan tanpa konfirmasi manual'
                },
                {
                  id: 'bca_va',
                  label: 'Virtual Account BCA (Otomatis)',
                  icon: Building2,
                  desc: 'Transfer via m-BCA atau KlikBCA'
                },
                {
                  id: 'mandiri_va',
                  label: 'Virtual Account Mandiri / Livin',
                  icon: Building2,
                  desc: 'Transfer via aplikasi Livin by Mandiri'
                },
                {
                  id: 'bank_transfer',
                  label: 'Transfer Bank Manual (BCA 8899-123456 a.n Fadhil Store)',
                  icon: CreditCard,
                  desc: 'Konfirmasi via WhatsApp atau upload bukti bayar'
                }
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.label;
                return (
                  <label
                    key={m.id}
                    onClick={() => setPaymentMethod(m.label)}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30'
                        : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={isSelected}
                      onChange={() => setPaymentMethod(m.label)}
                      className="mt-1 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="font-bold text-zinc-900 dark:text-white">{m.label}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{m.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Notes */}
            <div className="pt-2 text-xs">
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Catatan Tambahan (Opsional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Misal: Mohon kirim file e-book alternatif ke email kantor..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Summary Card */}
        <div>
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-md space-y-5 sticky top-24">
            <h3 className="font-bold text-base text-zinc-900 dark:text-white">
              Ringkasan Pesanan ({totalItems} Item)
            </h3>

            {/* List preview */}
            <div className="max-h-52 overflow-y-auto space-y-3 pr-1 text-xs">
              {items.map((it) => (
                <div key={it.product.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={it.product.image_url}
                      alt={it.product.title}
                      className="w-10 h-10 object-cover rounded-lg bg-zinc-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                        {it.product.title}
                      </p>
                      <span className="text-[10px] text-zinc-400">
                        {it.quantity} x {formatIDR(it.product.price)}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-zinc-900 dark:text-white shrink-0">
                    {formatIDR(it.product.price * it.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex justify-between">
                <span>Subtotal Produk</span>
                <span className="font-semibold text-zinc-900 dark:text-white">{formatIDR(subtotal)}</span>
              </div>

              {hasPhysicalItems && (
                <div className="flex justify-between">
                  <span>Ongkos Kirim Kurir</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">{formatIDR(shippingFee)}</span>
                </div>
              )}

              {hasDigitalItems && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Ongkir Digital Download</span>
                  <span className="font-bold">Rp 0 (GRATIS)</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Biaya Transaksi</span>
                <span className="font-semibold text-zinc-900 dark:text-white">Rp 0</span>
              </div>
            </div>

            {/* Total Grand */}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-baseline justify-between">
              <span className="text-sm font-bold text-zinc-900 dark:text-white">Total Akhir</span>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {formatIDR(grandTotal)}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Menyimpan Pesanan ke Supabase...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Bayar & Proses Pesanan</span>
                </>
              )}
            </button>

            <div className="pt-2 text-[10px] text-zinc-400 text-center leading-relaxed">
              Dengan mengklik tombol di atas, transaksi Anda otomatis disimpan ke tabel Supabase <code>orders</code> & <code>order_items</code>.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
