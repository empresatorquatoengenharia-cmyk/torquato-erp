import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';

/**
 * Carrega uma tabela filtrando SEMPRE pela empresa ativa (no servidor).
 */
export function useTable<T = any>(tabela: string, empresa: string, order = 'created_at', asc = false) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    if (!empresa) {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from(tabela)
      .select('*')
      .eq('empresa', empresa)
      .order(order, { ascending: asc });
    if (error) {
      setError(error.message);
    } else {
      setRows((data || []) as T[]);
      setError('');
    }
    setLoading(false);
  }, [tabela, empresa, order, asc]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { rows, loading, error, reload };
}

/** Retorna a mensagem de erro ou null se deu certo. */
export async function inserir(tabela: string, obj: Record<string, any>) {
  const { error } = await supabase.from(tabela).insert([obj]);
  return error ? error.message : null;
}

export async function atualizar(tabela: string, id: string, obj: Record<string, any>) {
  const { error } = await supabase.from(tabela).update(obj).eq('id', id);
  return error ? error.message : null;
}

export async function excluir(tabela: string, id: string) {
  const { error } = await supabase.from(tabela).delete().eq('id', id);
  return error ? error.message : null;
}
