'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, ADMIN_EMAILS, isUserAdmin } from '@/context/AuthContext';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  KeyRound,
  UserCheck
} from 'lucide-react';

function AdminLoginForm() {
  const router = useRouter();
  const { login, register, user, isAdmin, isSupabaseConnected } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('muhammadfadhilnasir123@gmail.com');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('Muhammad Fadhil Nasir');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // If already logged in as admin, redirect to /admin
  React.useEffect(() => {
    if (user && isAdmin) {
      router.push('/admin');
    }
  }, [user, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        setIsLoading(false);

        if (res.success) {
          // Double check if the logged in email has admin privileges
          if (!isUserAdmin(email)) {
            setErrorMessage(
              'Akun Anda berhasil masuk, tetapi email ini tidak terdaftar sebagai Administrator FadhilStore. Halaman panel admin hanya untuk pengelola toko.'
            );
            return;
          }
          router.push('/admin');
        } else {
          setErrorMessage(
            res.error || 'Autentikasi admin gagal. Pastikan email dan password sudah benar.'
          );
        }
      } else {
        // Register mode for admin
        if (!isUserAdmin(email)) {
          setIsLoading(false);
          setErrorMessage(
            `Pendaftaran di portal admin hanya diizinkan untuk email administrator resmi (${ADMIN_EMAILS.join(', ')}). Untuk pelanggan biasa, silakan daftar di halaman registrasi umum.`
          );
          return;
        }

        const res = await register(email, password, fullName);
        setIsLoading(false);

        if (res.success) {
          setSuccessMessage('Akun Administrator berhasil dibuat! Mengalihkan ke panel admin...');
          setTimeout(() => {
            router.push('/admin');
          }, 1200);
        } else {
          setErrorMessage(res.error || 'Gagal mendaftarkan akun administrator.');
        }
      }
    } catch (err: unknown) {
      setIsLoading(false);
      setErrorMessage(err instanceof Error ? err.message : 'Terjadi kesalahan sistem.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white">
      <div className="w-full max-w-md space-y-6">
        {/* Top Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Beranda Toko</span>
        </Link>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-500 items-center justify-center text-white shadow-xl shadow-indigo-600/30">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Portal Administrator
          </h1>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Akses khusus pengelola toko <b>FadhilStore</b> untuk mengelola produk, pesanan, dan inventaris.
          </p>
        </div>

        {/* Admin Card */}
        <div className="bg-zinc-900/90 rounded-3xl p-6 sm:p-8 border border-zinc-800 shadow-2xl backdrop-blur-xl space-y-5">
          {/* Status Pill */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-950/50 border border-indigo-800/60 text-xs">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Akses Terproteksi</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-900/80 text-indigo-200">
              Role: Admin
            </span>
          </div>

          {/* Quick-fill button for primary admin */}
          <div className="flex items-center justify-between text-xs bg-zinc-800/60 p-2.5 rounded-xl border border-zinc-700/60">
            <div className="flex items-center gap-2 truncate text-zinc-300">
              <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate text-[11px] font-mono">muhammadfadhilnasir123@gmail.com</span>
            </div>
            <button
              type="button"
              onClick={() => setEmail('muhammadfadhilnasir123@gmail.com')}
              className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold shrink-0 transition"
            >
              Gunakan
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`py-2 rounded-lg transition ${
                mode === 'login'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Masuk Akun Admin
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage('');
              }}
              className={`py-2 rounded-lg transition ${
                mode === 'register'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Daftar Akun Admin
            </button>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'register' && (
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Nama Lengkap Admin
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nama Lengkap"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Alamat Email Administrator
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 absolute left-3.5 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 absolute left-3.5 text-zinc-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/40 transition disabled:opacity-50"
            >
              {isLoading ? (
                <span>Memproses Autentikasi...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {mode === 'login' ? 'Masuk ke Dashboard Toko' : 'Daftarkan Akun Administrator'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to customer login */}
          <div className="pt-4 border-t border-zinc-800 text-center text-xs text-zinc-400 space-y-1">
            <p>Bukan administrator pengelola toko?</p>
            <Link
              href="/login"
              className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline inline-flex items-center gap-1"
            >
              <span>Masuk sebagai Pelanggan Biasa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center text-xs text-zinc-400 bg-black">
          Memuat Portal Administrator...
        </div>
      }
    >
      <AdminLoginForm />
    </React.Suspense>
  );
}
