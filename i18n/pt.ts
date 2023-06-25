import { LabelsType } from "./labelsType.ts";

export const pt: LabelsType = {
    authSuccess: "Autenticado com sucesso!",
    welcome: "Wodbot 5.0 entrou!",
    dices: "Dados",
    difficulty: "Dificuldade",
    modifier: "Modificador",
    successes: "Sucessos",
    status: "Status",
    player: "Jogador",
    bestialFailure: "Falha Bestial",
    failure: "Falha",
    success: "Sucesso",
    regularCritical: "Crítico",
    messyCritical: "Crítico Bestial",
    reRollHelperText: "Re-rolando %v dado(s) da última jogada...",
    configNotFound: "Nenhum arquivo de configuração encontrado.",
    storytellerChangeDifficulty: "O narrador mudou a dificuldade.",
    storytellerChangeModifier: "O narrador mudou o modificador.",
    changeCharacterSuccess: "Novo personagem selecionado: %v",
    loadCharacterSuccess: "Personagem carregado: %v -> %v",
    loadCharacterError: "Erro ao carregar o arquivo: %v", 
    uploadCharacterSuccess: "O personagem foi enviado com sucesso", 
    uploadCharacterError: "O personagem nao pode ser enviado, fale com o seu narrador.",
    currentCharacter: "Personagem selecionado",
    loading: "Carregando...",
    openYourCharacter: "Abra sua ficha clicando aqui",
    actions: {
        setDifficulty: "Alterar dificuldade",
        setBonus: "Inserir uma bonificação",
        setOnus: "Inserir uma penalidade",
        reloadCharacters: "Recarregar personagens",
        characterManager: "Gerencie o personagem: %v"
    },
    commands: {
        roll: {
            name: "jogar",
            description: "Jogue dados de dez faces",
            dices: {
                name: "dados",
                description: "Quantidade de dados"
            },
            hunger: {
                name: "fome",
                description: "Quantidade de fome do vampiro"
            },
            difficulty: {
                name: "dificuldade",
                description: "Dificuldade da jogada"
            },
            descriptionField: {
                name: "descrição",
                description: "Descrição da jogada"
            }   
        },
        uploadCharacter: {
            name: "enviar",
            description: "Envie sua ficha para o narrador",
            file: {
                name: "ficha",
                description: "Ficha a ser enviada"
            }
        }
    },
    dicePools: [{
        name: "Ameaçar veladamente",
        description: "Ameaçar veladamente [Manipulação + Intimidação]"
    },{
        name: "Ataque com os punhos",
        description: "Ataque com os punhos [Força + Briga]"
    },{
        name: "Cantar",
        description: "Cantar [Carisma + Performance]"
    },{
        name: "Conduzir suas ações com perfeição em um jantar formal",
        description: "Conduzir suas ações com perfeição em um jantar formal [Destreza + Etiqueta]"
    },{
        name: "Corrida prolongada",
        description: "Corrida prolongada [Vigor + Atletismo]"
    },{
        name: "Decifrar uma ameaça velada",
        description: "Decifrar uma ameaça velada [Raciocínio + Intimidação]"
    },{
        name: "Descobrir o nível de segurança de um local",
        description: "Descobrir o nível de segurança de um local [Inteligência + Ladroagem]"
    },{
        name: "Descobrir informações sobre uma gangue",
        description: "Descobrir informações sobre uma gangue [Carisma + Manha]"
    },{
        name: "Desviar de um obstáculo enquanto dirigi",
        description: "Desviar de um obstáculo enquanto dirigi [Raciocínio + Condução]"
    },{
        name: "Distrair cães de guarda enquanto se infiltra",
        description: "Distrair cães de guarda enquanto se infiltra [Manipulação + Empatia com Animais]"
    },{
        name: "Emparelhar um veículo enquanto dirigi",
        description: "Emparelhar um veículo enquanto dirigi [Raciocínio + Condução]"
    },{
        name: "Encontrar abrigo para passar o dia",
        description: "Encontrar abrigo para passar o dia [Raciocínio + Sobrevivência]"
    },{
        name: "Fazer uma tocaia",
        description: "Fazer uma tocaia [Vigor + Furtividade]"
    },{
        name: "Intimidar",
        description: "Intimidar [Carisma + Intimidação]"
    },{
        name: "Ler um livro esotérico",
        description: "Ler um livro esotérico [Inteligência + Ocultismo]"
    },{
        name: "Reforçar uma porta de refúgio",
        description: "Reforçar uma porta de refúgio [Raciocínio + Ofícios]"
    },{
        name: "Sacar uma arma de forma velada",
        description: "Sacar uma arma de forma velada [Destreza + Subterfúgio]"
    },{
        name: "Verificar credibilidade de uma história",
        description: "Verificar credibilidade de uma história [Manipulação + Persuasão]"
    }]
};