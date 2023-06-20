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
    loadCharacterSuccess: "Personagem atualizado: %v",
    currentCharacter: "Personagem selecionado",
    loading: "Carregando...",
    openYourCharacter: "Abra sua ficha clicando no link!",
    dicePools: {
        attackWithFists: {
            name: "Ataque com os Punhos",
            description: "Ataque com os Punhos [Força + Briga]"
        }
    },
    commands: {
        setDifficulty: "Alterar dificuldade",
        setBonus: "Inserir uma bonificação",
        setOnus: "Inserir uma penalidade",
        reloadCharacters: "Recarregar personagens",
        characterManager: "Gerencie o personagem: %v"
    },
    log: {
        interactionCreateEvent: "Comando: %v - Opção: %v",
        messageCreateEvent: "Messagem: %v"
    }
};