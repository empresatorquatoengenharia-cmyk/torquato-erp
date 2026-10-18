```python
class FinanceiroModule:
    """Módulo individualizado para gestão Financeira e Contábil."""
    
    def __init__(self):
        self.transacoes = []

    def registrar_transacao(self, descricao, valor, tipo):
        transacao = {"descricao": descricao, "valor": valor, "tipo": tipo}
        self.transacoes.append(transacao)
        print(f"[Financeiro] Transação registrada: {descricao} - R$ {valor}")
```

---

### 3. Módulo Administrativo (`modules/administrativo.py`)
Responsável pelo cadastro de parceiros, fornecedores e configurações gerais.
```python
class AdministrativoModule:
    """Módulo individualizado para Configurações e Cadastros Gerais."""
    
    def __init__(self):
        self.parceiros = []

    def cadastrar_parceiro(self, nome, documento, tipo):
        parceiro = {"nome": nome, "documento": documento, "tipo": tipo}
        self.parceiros.append(parceiro)
        print(f"[Administrativo] Parceiro cadastrado: {nome}")
```
