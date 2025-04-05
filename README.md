# Aplicativo de Agendamento para Salão de Beleza

Um aplicativo simples para gerenciar agendamentos em salões de beleza.

## Funcionalidades

- Calendário visual para seleção de datas
- Formulário de agendamento com validação
- Visualização de horários disponíveis
- Armazenamento local de agendamentos (localStorage)
- Lista de serviços oferecidos
- Design responsivo para visualização em dispositivos móveis

## Como Usar

1. Abra o arquivo `index.html` em seu navegador
2. Selecione uma data no calendário 
3. Escolha um serviço e horário disponível
4. Preencha seus dados pessoais
5. Confirme o agendamento

## Estrutura do Projeto

- `index.html` - Estrutura principal da página
- `styles.css` - Estilos e aparência do aplicativo
- `script.js` - Lógica de funcionamento e interatividade

## Personalizações Possíveis

### Para adicionar novos serviços:

1. Edite a seção de serviços no HTML
2. Adicione opções no seletor de serviços no formulário

### Para modificar horários disponíveis:

1. Edite o objeto `horariosPorDia` no arquivo JavaScript
2. Ajuste as opções no seletor de horários no HTML

## Próximos Passos

- Adicionar autenticação de usuários
- Implementar área administrativa para o salão
- Adicionar notificações por e-mail ou SMS
- Desenvolver um painel de controle para os funcionários 