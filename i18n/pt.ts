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
    loadCharacterSuccess: "Personagem carregado: %v",
    loadCharacterError: "Erro ao carregar o personagem: %v", 
    uploadCharacterSuccess: "O personagem foi enviado com sucesso", 
    uploadCharacterError: "O personagem nao pode ser enviado, fale com o seu narrador.",
    currentCharacter: "Personagem selecionado",
    loading: "Carregando...",
    openYourCharacter: "Abra sua ficha clicando aqui",
    dicePools: {
        attackWithFists: {
            name: "Ataque com os Punhos",
            description: "Ataque com os Punhos [Força + Briga]"
        }
    },
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
    }
};