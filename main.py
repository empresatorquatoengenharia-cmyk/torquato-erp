```python
from modules.suprimentos import SuprimentosModule
from modules.financeiro import FinanceiroModule
from modules.administrativo import AdministrativoModule

def main():
    print("========================================")
    print(" Inicializando Sistema Modularizado Koper")
    print("========================================")
    
    # Instanciando módulos de forma isolada
    suprimentos = SuprimentosModule()
    financeiro = FinanceiroModule()
    administrativo = AdministrativoModule()
    
    # Exemplo de teste da modularização
    suprimentos.cadastrar_epi(4925, "Uniforme Camisas", "N/A", 5, "Vila real")
    financeiro.registrar_transacao("Pagamento Guia DAS", 550.00, "Saída")
    administrativo.cadastrar_parceiro("Contabilidade Ribeiro", "00.000.000/0001-00", "Contabilidade/Parceiro")
    
    print("========================================")
    print(" Todos os módulos carregados com sucesso!")
    print("========================================")

if __name__ == "__main__":
    main()
```
