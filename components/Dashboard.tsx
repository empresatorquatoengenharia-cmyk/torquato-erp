'use client';
import React, { useMemo, useState } from 'react';
import { LayoutDashboard, DollarSign, Filter, BarChart3, PieChart, AlertTriangle } from 'lucide-react';
import { useTable } from '@/lib/data';
import { brl, hoje, CATEGORIAS, CENTROS_PADRAO } from '@/lib/utils';
import { Card, PageHeader, ErrorBox, Loading, Empty } from './ui';

const selectCls =
  'bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-bold cursor-pointer text-xs focus:outline-none';

export default function Dashboard({ empresa, onIrFinanceiro }: { empresa: string; onIrFinanceiro: () => void }) {
  const pagar = useTable('financeiro_lancamentos', empresa, 'vencimento', true);
  const receber = useTable('financeiro_receber', empresa, 'vencimento', true);
  const bancos = useTable('contas_bancarias', empresa);

  const [status, setStatus] = useState('todos');
  const [centro, setCentro] = useState('todos');
  const [categoria, setCategoria] = useState('todas');

  const centros = useMemo(
    () =>
      Array.from(
        new Set([...CENTROS_PADRAO, ...pagar.rows.map((r: any) => r.centro_custo).filter(Boolean)])
      ),
    [pagar.rows]
  );

  const pagarFiltrado = useMemo(
    () =>
      pagar.rows.filter((i: any) => {
        if (status === 'pagos' && i.status !== 'Pago') return false;
        if (status === 'pendentes' && i.status === 'Pago') return false;
        if (centro !== 'todos' && (i.centro_custo || 'Geral / Sede') !== centro) return false;
        if (categoria !== 'todas' && i.categoria !== categoria) return false;
        return true;
      }),
    [pagar.rows, status, centro, categoria]
  );

  const soma = (arr: any[]) => arr.reduce((a, i) => a + Number(i.valor || 0), 0);

  const saldoBancos = bancos.rows.reduce((a: number, i: any) => a + Number(i.saldo || 0), 0);
  const pagarPendente = soma(pagar.rows.filter((i: any) => i.status !== 'Pago'));
  const receberPendente = soma(receber.rows.filter((i: any) => i.status !== 'Recebido'));
  const resultadoProjetado = receberPendente - pagarPendente;

  const pagarFiltPendente = soma(pagarFiltrado.filter((i: any) => i.status !== 'Pago'));
  const pagarFiltPago = soma(pagarFiltrado.filter((i: any) => i.status === 'Pago'));

  const vencidos = pagar.rows.filter((i: any) => i.status !== 'Pago' && i.vencimento && i.vencimento < hoje());

  const porCentro = pagarFiltrado.reduce((acc: Record<string, number>, i: any) => {
    const cc = i.centro_custo || 'Geral / Sede';
    acc[cc] = (acc[cc] || 0) + Number(i.valor || 0);
    return acc;
  }, {});
  const totalFiltrado = Object.values(porCentro).reduce((a, b) => a + b, 0);

  const carregando = pagar.loading || receber.loading || bancos.loading;
  const erro = pagar.error || receber.error || bancos.error;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<LayoutDashboard className="w-6 h-6 text-amber-500" />}
        title="Dashboard Executivo"
        subtitle={
          <>
            Visão financeira de <span className="text-amber-400 font-bold">{empresa}</span>
          </>
        }
        actions={
          <button
            onClick={onIrFinanceiro}
            className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer"
          >
            <DollarSign className="w-4 h-4" /> Ir para Financeiro
          </button>
        }
      />

      <ErrorBox message={erro} />
      {carregando && <Loading />}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-xs font-bold text-slate-400">Saldo bancário total</p>
          <h3 className="text-xl font-black text-amber-400">{brl(saldoBancos)}</h3>
        </Card>
        <Card>
          <p className="text-xs font-bold text-slate-400">A pagar (pendente)</p>
          <h3 className="text-xl font-black text-rose-400">{brl(pagarPendente)}</h3>
          {vencidos.length > 0 && (
            <p className="text-[11px] text-rose-300 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> {vencidos.length} vencido(s)
            </p>
          )}
        </Card>
        <Card>
          <p className="text-xs font-bold text-slate-400">A receber (pendente)</p>
          <h3 className="text-xl font-black text-emerald-400">{brl(receberPendente)}</h3>
        </Card>
        <Card>
          <p className="text-xs font-bold text-slate-400">Resultado projetado (receber − pagar)</p>
          <h3 className={`text-xl font-black ${resultadoProjetado >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
            {brl(resultadoProjetado)}
          </h3>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-sm text-white">Filtros de custos</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${selectCls} text-slate-200`}>
              <option value="todos">Status: todos</option>
              <option value="pagos">Status: pagos</option>
              <option value="pendentes">Status: pendentes</option>
            </select>
            <select value={centro} onChange={(e) => setCentro(e.target.value)} className={`${selectCls} text-amber-400`}>
              <option value="todos">Centro de custo: todos</option>
              {centros.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className={`${selectCls} text-slate-200`}>
              <option value="todas">Categoria: todas</option>
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400">Pendente (filtro)</p>
            <p className="font-black text-rose-400 text-base">{brl(pagarFiltPendente)}</p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400">Pago (filtro)</p>
            <p className="font-black text-emerald-400 text-base">{brl(pagarFiltPago)}</p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400">Total (filtro)</p>
            <p className="font-black text-amber-400 text-base">{brl(totalFiltrado)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-xs text-slate-300 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-500" /> Custos por obra / centro de custo
            </h4>
            {Object.keys(porCentro).length === 0 && <Empty text="Nenhum lançamento para esse filtro." />}
            {Object.entries(porCentro).map(([nome, valor]) => {
              const pct = totalFiltrado > 0 ? (valor / totalFiltrado) * 100 : 0;
              return (
                <div key={nome} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{nome}</span>
                    <span className="text-amber-400">
                      {brl(valor)} ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-xs text-slate-300 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-400" /> Fluxo geral
            </h4>
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex justify-between">
                <span className="text-emerald-400">A receber (pendente)</span>
                <span className="font-bold text-emerald-400">{brl(receberPendente)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-rose-400">A pagar (pendente)</span>
                <span className="font-bold text-rose-400">{brl(pagarPendente)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-3">
                <span className="text-slate-300">Saldo em contas + resultado</span>
                <span className="font-bold text-amber-400">{brl(saldoBancos + resultadoProjetado)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
