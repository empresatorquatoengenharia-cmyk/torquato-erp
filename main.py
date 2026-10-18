from modules.suprimentos import SuprimentosModule
from modules.financeiro import FinanceiroModule
from modules.administrativo import AdministrativoModule

def main():
    print("========================================")
    print(" Inicializando Sistema Modularizado Koper")
    print("========================================")
    
    suprimentos = SuprimentosModule()
    financeiro = FinanceiroModule()
    administrativo = AdministrativoModule()
    
    # Teste do Módulo Financeiro Unificado
    financeiro.calcular_fluxo_caixa(4196061.32, 26033.45, 888.87, 52937.98, 11.94)
    financeiro.registrar_conta_pagar(17829, "56115", "Casas D' Água - Biguaçu", 18.00, "01/05/2026", "Casa Diário", ["Material de consumo"])
    financeiro.registrar_conta_receber(101, "Construtora Horizonte", 26097.19, "10/05/2026", "Residencial Viena", ["Serviços"])
    financeiro.registrar_nota_fiscal("56115", "Casas D' Água - Biguaçu", 18.00, "Casa Diário")
    financeiro.registrar_tributo("Guia DAS", "04/2026", 550.00, "Geral", "Simples Nacional")
    
    print("========================================")
    print(" Módulo Financeiro configurado com sucesso!")
    print("========================================")

if __name__ == "__main__":
    main()
