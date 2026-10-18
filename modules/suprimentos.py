```python
class SuprimentosModule:
    """Módulo individualizado para gestão de Suprimentos (Koper)."""
    
    def __init__(self):
        self.epis = []
        self.entradas = []
        self.consumos = []
        self.balancos = []

    def cadastrar_epi(self, codigo, nome, ca, quantidade, local):
        epi = {"codigo": codigo, "nome": nome, "ca": ca, "quantidade": quantidade, "local": local}
        self.epis.append(epi)
        print(f"[Suprimentos] EPI cadastrado com sucesso: {nome}")

    def registrar_entrada(self, codigo, origem, local, itens):
        entrada = {"codigo": codigo, "origem": origem, "local": local, "itens": itens}
        self.entradas.append(entrada)
        print(f"[Suprimentos] Entrada registrada: Código {codigo} - Origem: {origem}")

    def registrar_consumo(self, codigo, local_consumo, retirado_por, itens):
        consumo = {"codigo": codigo, "local": local_consumo, "retirado_por": retirado_por, "itens": itens}
        self.consumos.append(consumo)
        print(f"[Suprimentos] Consumo registrado para: {retirado_por}")

    def realizar_balanco(self, codigo, local, setor, data_prevista):
        balanco = {"codigo": codigo, "local": local, "setor": setor, "data_prevista": data_prevista, "status": "Pendente"}
        self.balancos.append(balanco)
        print(f"[Suprimentos] Balanço agendado para o local: {local}")
```
