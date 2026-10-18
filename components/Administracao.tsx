'use client';
import React, { useState } from 'react';
import { ShieldCheck, Building2, Trash2 } from 'lucide-react';
import { inserir, excluir } from '@/lib/data';
import { formatarData } from '@/lib/utils';
import { Card, PageHeader, ErrorBox, Empty, inputCls } from './ui';

export default function Administracao({
  empresas,
  email,
  onAtualizar,
}: {
  empresas: any[];
  email: string;
  onAtualizar: () => void;
}) {
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');

  async function adicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;
    const msg = await inserir('empresas_erp', { nome: nome.trim() });
    if (msg) return setErro(msg);
    setNome('');
    setErro('');
    onAtualizar();
  }

  async function remover(emp: any) {
    if (
      !confirm(
        `Excluir a empresa "${emp.nome}"?\n\nOs lançamentos e cadastros dela NÃO são apagados, mas deixarão de aparecer enquanto a empresa não existir.`
      )
    )
      return;
    const msg = await excluir('empresas_erp', emp.id);
    if (msg) alert('Erro: ' + msg);
    onAtualizar();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<ShieldCheck className="w-6 h-6 text-amber-500" />}
        title="Administração e Governança"
        subtitle={
          <>
            Usuário logado: <span className="text-amber-400 font-bold">{email}</span>
          </>
        }
      />

      <Card>
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Building2 className="w-4 h-4 text-amber-500" /> Empresas do grupo
        </h3>

        <form onSubmit={adicionar} className="flex gap-2">
          <input
            placeholder="Nome da nova empresa"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={inputCls}
          />
          <button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer whitespace-nowrap">
            Adicionar empresa
          </button>
        </form>
        <ErrorBox message={erro} />

        {empresas.length === 0 ? (
          <Empty text="Nenhuma empresa cadastrada. Adicione a primeira acima para liberar os demais módulos." />
        ) : (
          <div className="divide-y divide-slate-800">
            {empresas.map((emp) => (
              <div key={emp.id} className="flex items-center justify-between py-3 text-xs">
                <div>
                  <p className="font-bold text-white">{emp.nome}</p>
                  <p className="text-slate-500">Criada em {formatarData(emp.created_at)}</p>
                </div>
                <button onClick={() => remover(emp)} aria-label="Excluir empresa" className="cursor-pointer">
                  <Trash2 className="w-4 h-4 text-slate-500 hover:text-rose-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h3 className="font-bold text-sm text-white">Como criar novos usuários</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          No painel do Supabase, abra <b className="text-slate-200">Authentication → Users → Add user</b> e informe e-mail e senha.
          O cadastro público não existe nesta tela de propósito: só quem você criar consegue entrar.
        </p>
      </Card>
    </div>
  );
}
