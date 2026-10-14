# Aplicativo de Cuidados Pós-Operatórios

Aplicativo voltado para a área da saúde, pensado para o acompanhamento de pacientes que estão se recuperando de cirurgia em casa. O próprio paciente monitora e registra a sua recuperação no dia a dia e pode gerar um **relatório em PDF** para compartilhar com o profissional de saúde que o acompanha.

> Projeto de estudos, com possibilidade de evolução para um produto comercial no futuro.
>
> **Aviso:** este aplicativo é de apoio e **não substitui** a orientação do médico ou da equipe de saúde. Em caso de emergência, procure atendimento médico ou ligue para o SAMU (192).

<!-- Adicione aqui um print ou GIF da tela principal do app, por exemplo:
![Tela principal](docs/tela-principal.png) -->

## Funcionalidades

- **Perfis**: crie, selecione e exclua perfis de pacientes no mesmo dispositivo
- **Cadastro guiado em 3 etapas**: dados pessoais e da cirurgia, contatos do médico e do hospital (opcionais) e medicamentos
- **Painel principal**: acompanha os dias de recuperação e permite editar as informações do paciente
- **Cuidados pós-operatórios**: guias sobre exercícios respiratórios, curativo, mobilidade, ostomias e drenos, e monitoramento
- **Medicamentos**: cadastro com dose, frequência (a cada 4, 6, 8 horas...) e horários
- **Controle da dor**: registro do nível de dor de 0 a 10 (sem dor, leve, moderada, forte) com histórico
- **Sinais de alerta**: lista de sinais que exigem atenção (febre alta, sangramento excessivo, falta de ar, abertura da ferida, entre outros), com registro de data, hora e observações
- **Checklist diário**: medicamentos tomados, dor registrada, movimentação, ferida, curativo, funcionamento intestinal e como o paciente se sentiu no dia
- **Contatos de emergência**: médico, hospital, enfermagem, SAMU (192) e Bombeiros (193)
- **Relatório em PDF**: gerado no próprio navegador, com dados do paciente, medicamentos, histórico de dor (média, maior e menor nível) e sinais de alerta
- **Finalizar tratamento**: apaga todos os dados do perfil ao fim da recuperação

## Privacidade dos dados

Esta versão **não possui servidor nem banco de dados**: todas as informações ficam salvas apenas no navegador do próprio usuário (`localStorage`), separadas por perfil. Nenhum dado é enviado para a internet. O relatório em PDF é gerado e baixado localmente, e o paciente decide como compartilhá-lo.

## Tecnologias

- [React 18](https://react.dev/) com [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) como ferramenta de build
- [Tailwind CSS 4](https://tailwindcss.com/) para estilização
- [React Router 7](https://reactrouter.com/) para navegação entre telas
- [shadcn/ui](https://ui.shadcn.com/) (componentes baseados em Radix UI) e [Lucide](https://lucide.dev/) para ícones
- [jsPDF](https://github.com/parallax/jsPDF) para geração do relatório

## Páginas do aplicativo

| Rota | Tela |
|------|------|
| `/` | Seleção de perfil |
| `/setup` | Cadastro de novo perfil |
| `/menu` | Painel principal |
| `/cuidados` | Cuidados pós-operatórios |
| `/medicamentos` | Meus medicamentos |
| `/dor` | Controle da dor |
| `/alertas` | Sinais de alerta |
| `/checklist` | Checklist diário |
| `/emergencia` | Contatos de emergência |

## Como rodar

**Pré-requisito:** [Node.js](https://nodejs.org/) 18 ou superior.

```bash
git clone https://github.com/SEU_USUARIO/Aplicativo_de_Cuidados_Pos_Operatorios.git
cd Aplicativo_de_Cuidados_Pos_Operatorios
npm install
npm run dev
```

O Vite mostrará no terminal o endereço local (normalmente `http://localhost:5173`).

Para gerar a versão de produção:

```bash
npm run build
```

## Próximos passos

- Criar um **back-end com API** para salvar os dados na nuvem e permitir acesso por mais de um dispositivo
- **Enviar o relatório diretamente** ao profissional de saúde, além de baixar o PDF
- Adicionar **login com autenticação** e cuidados extras com a proteção dos dados de saúde
- Incluir vídeos específicos para cada guia de cuidado (hoje há um vídeo de exemplo)
- Adicionar testes automatizados e transformar o app em PWA para uso no celular

## Créditos e contribuição

O ponto de partida foi um protótipo visual gerado no [Figma Make](https://www.figma.com/design/AaDTnehJqcoQcWOufzXVWm/Aplicativo-de-Cuidados-P%C3%B3s-Operat%C3%B3rios). A partir dele, desenvolvi a lógica de funcionamento do app: a lógica das telas e o armazenamento dos dados no navegador com `localStorage`, organizado por perfil.

Os componentes de interface vêm do [shadcn/ui](https://ui.shadcn.com/) (licença MIT) e as fotos do [Unsplash](https://unsplash.com/), conforme descrito em [`ATTRIBUTIONS.md`](./ATTRIBUTIONS.md).
