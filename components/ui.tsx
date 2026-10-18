'use client';
import React from 'react';
import { X } from 'lucide-react';

export const inputCls =
  'w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500';

export function Modal({
  title,
  onClose,
  children,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className={`bg-slate-900 rounded-2xl shadow-2xl ${
          wide ? 'max-w-2xl' : 'max-w-md'
        } w-full max-h-[90vh] overflow-y-auto p-6 border border-slate-800 space-y-4 text-slate-200`}
      >
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white">{title}</h3>
          <button onClick={onClose} aria-label="Fechar">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-[11px] font-bold text-slate-400">{label}</span>
      {children}
    </label>
  );
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({
  icon,
  title,
  subtitle,
  actions,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-4">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          {icon} {title}
        </h1>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Tabs({
  tabs,
  active,
  onChange,
  accent = 'amber',
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
  accent?: 'amber' | 'emerald';
}) {
  const on = accent === 'amber' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white';
  return (
    <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap ${
            active === t.id ? on : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function ErrorBox({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl p-3">
      {message}
    </div>
  );
}

export function Empty({ text }: { text: string }) {
  return <p className="text-xs text-slate-500 py-6 text-center">{text}</p>;
}

export function Loading() {
  return <p className="text-xs text-slate-500 py-6 text-center">Carregando...</p>;
}
