class FinanceiroModule:
    """Módulo individualizado para gestão Financeira e Contábil (Koper)."""
    
    def __init__(self):
        self.transacoes = []
        self.contas_pagar = []
        self.contas_receber = []
        self.notas_fiscais = []
        self.tributos = []
        self.contas_bancarias = []

    # ==========================================
    # 1. FLUXO DE CAIXA E SALDOS
    # ==========================================
    def calcular_fluxo_caixa(self, saldo_anterior, entradas_efetivadas, saidas_efetivadas, entradas_previstas, saidas_previstas):
        saldo_atual = saldo_anterior + entradas_efetivadas - saidas_efetivadas
        saldo_final_previsto = saldo_atual + entradas_previstas - saidas_previstas
        
        panorama = {
            "saldo_mes_anterior": saldo_anterior,
            "entradas_efetivadas": entradas_efetivadas,
            "saidas_efetivadas": saidas_efetivadas,
            "saldo_atual": saldo_atual,
            "entradas_previstas": entradas_previstas,
            "saidas_previstas": saidas_previstas,
            "saldo_final_previsto": saldo_final_previsto
        }
        print(f"[Financeiro] Fluxo de Caixa calculado. Saldo Atual: R$ {saldo_atual:,.2f} | Saldo Final Previsto: R$ {saldo_final_previsto:,.2f}")
        return panorama

    def adicionar_estatistica_grafico(self, tipo_grafico, periodo, dados):
        print(f"[Financeiro] Gráfico '{tipo_grafico}' configurado para o período: {periodo}.")

    # ==========================================
    # 2. CONTAS A PAGAR (Com etiquetas, anexos e relatórios)
    # ==========================================
    def registrar_conta_pagar(self, codigo, nfe_recibo, beneficiario, valor, vencimento, centro_custo, etiquetas=None, recorrente=False):
        conta = {
            "codigo": codigo,
            "nfe_recibo": nfe_recibo,
            "beneficiario": beneficiario,
            "valor": valor,
            "vencimento": vencimento,
            "centro_custo": centro_custo,
            "etiquetas": etiquetas or [],
            "recorrente": recorrente,
            "status": "Pendente",
            "anexo_comprovante": None,
            "anexo_boleto": None
        }
        self.contas_pagar.append(conta)
        print(f"[Financeiro] Conta a Pagar #{codigo} registrada: {beneficiario} - R$ {valor} (Venc: {vencimento})")

    def adicionar_etiqueta_conta_pagar(self, codigo, etiqueta):
        for conta in self.contas_pagar:
            if conta["codigo"] == codigo:
                if etiqueta not in conta["etiquetas"]:
                    conta["etiquetas"].append(etiqueta)
                    print(f"[Financeiro] Etiqueta '{etiqueta}' adicionada à conta #{codigo}.")
                return True
        return False

    def anexar_documento_pagar(self, codigo, tipo, caminho_arquivo):
        """Tipo pode ser 'comprovante' ou 'boleto'"""
        for conta in self.contas_pagar:
            if conta["codigo"] == codigo:
                if tipo == "comprovante":
                    conta["anexo_comprovante"] = caminho_arquivo
                elif tipo == "boleto":
                    conta["anexo_boleto"] = caminho_arquivo
                print(f"[Financeiro] Anexo de {tipo} adicionado com sucesso à conta #{codigo}.")
                return True
        return False

    def exportar_relatorio_contas_pagar(self, filtro_centro_custo="Todos", filtro_periodo="Todos"):
        print(f"[Financeiro] Gerando relatório de Contas a Pagar | Centro de Custo: {filtro_centro_custo} | Período: {filtro_periodo}")
        # Simula a exportação estruturada em PDF/Excel vista nos relatórios
        relatorio = [c for c in self.contas_pagar]
        return relatorio

    # ==========================================
    # 3. CONTAS A RECEBER
    # ==========================================
    def registrar_conta_receber(self, id_recebimento, cliente, valor, vencimento, obra, etiquetas):
        recebimento = {
            "id": id_recebimento,
            "cliente": cliente,
            "valor": valor,
            "vencimento": vencimento,
            "obra": obra,
            "etiquetas": etiquetas,
            "status": "A Receber"
        }
        self.contas_receber.append(recebimento)
        print(f"[Financeiro] Conta a Receber cadastrada para {cliente} - R$ {valor}")

    def emitir_e_enviar_boleto(self, id_recebimento, canal="email"):
        for rec in self.contas_receber:
            if rec["id"] == id_recebimento:
                print(f"[Financeiro] Boleto emitido e enviado via {canal} para o cliente: {rec['cliente']}.")
                return True
        return False

    # ==========================================
    # 4. NOTAS ELETRÔNICAS E MANUAIS
    # ==========================================
    def registrar_nota_fiscal(self, numero_nota, fornecedor, valor, obra_rateio, recorrente=False):
        nota = {
            "numero": numero_nota,
            "fornecedor": fornecedor,
            "valor": valor,
            "obra_rateio": obra_rateio,
            "recorrente": recorrente,
            "integrada_sefaz": True
        }
        self.notas_fiscais.append(nota)
        print(f"[Financeiro] Nota Fiscal {numero_nota} integrada (Sefaz) e rateada para a obra: {obra_rateio}.")

    # ==========================================
    # 5. TRIBUTOS
    # ==========================================
    def registrar_tributo(self, imposto, competencia, valor, obra, fornecedor):
        tributo = {
            "imposto": imposto,
            "competencia": competencia,
            "valor": valor,
            "obra": obra,
            "fornecedor": fornecedor,
            "status": "Pendente"
        }
        self.tributos.append(tributo)
        print(f"[Financeiro] Tributo {imposto} (Comp: {competencia}) registrado no valor de R$ {valor}.")
