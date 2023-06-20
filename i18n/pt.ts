import { LabelsType } from "./labelsType.ts";

export const pt: LabelsType = {
    authSuccess: "Autenticado com sucesso!",
    welcome: "Wodbot 5.0 entrou!",
    dices: "Dados",
    difficulty: "Dificuldade",
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
    changeCharacterSuccess: "Novo personagem selecionado: %v",
    loadCharacterSuccess: "Personagem atualizado: %v",
    updateExperienceSuccess: "O personagem '%v' teve a experiência atualizada para: %v",
    updateHungerSuccess: "O personagem '%v' teve a fome atualizada para: %v",
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
        reloadCharacters: "Recarregar personagens",
        addExperience: "Aumentar experiência do personagem",
        decreaseExperience: "Remover experiência do personagem",
        characterManager: "Gerencie o personagem: %v",
        setHunger: "Ajustar fome do personagem"
    },
    log: {
        interactionCreateEvent: "Comando: %v - Opção: %v",
        messageCreateEvent: "Messagem: %v"
    }
};