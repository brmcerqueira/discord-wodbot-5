import { LabelsType } from "./labelsType.ts";

export const pt: LabelsType = {
    urlAuth: "Entre no link para autenticar -> %v",
    authSuccess: "Autenticado com sucesso!",
    closeThisFlap: "Ok! Pode fechar essa aba.",
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
    messyCritical: "Crítico Confuso",
    reRollHelperText: "Re-rolando %v dado(s) da última jogada...",
    configNotFound: "Nenhum arquivo de configuração encontrado.",
    storytellerChangeDifficulty: "O narrador mudou a dificuldade.",
    changeCharacterSuccess: "Novo personagem selecionado: %v",
    loadCharacterSuccess: "Personagem atualizado: %v",
    updateExperienceSuccess: "O personagem '%v' teve a experiência atualizada para: %v",
    jsonResponseError: "Http Error: %v %v %v %v",
    loading: "Carregando...",
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
        changeCharacterOption: "Mudar para o personagem: %v"
    },
    log: {
        emojiButtonEvent: "Emoji: %v - Message: %v - IsAdd: %v - Count: %v",
        messageCreateEvent: "Message: %v"
    }
};