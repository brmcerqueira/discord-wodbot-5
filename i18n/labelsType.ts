export type DicePoolType = {
    name: string,
    description: string,
}

export type LabelsType = {
    authSuccess: string,
    welcome: string,
    dices: string,
    difficulty: string,
    modifier: string,
    successes: string,
    status: string,
    player: string, 
    bestialFailure: string,
    failure: string,
    success: string,
    regularCritical: string,
    messyCritical: string,
    reRollHelperText: string,
    configNotFound: string,
    storytellerChangeDifficulty: string,
    storytellerChangeModifier: string,
    changeCharacterSuccess: string,
    loadCharacterSuccess: string,
    currentCharacter: string,
    loading: string,
    openYourCharacter: string,
    dicePools: {
        attackWithFists: DicePoolType
    },
    commands: {
        setDifficulty: string,
        setBonus: string,
        setOnus: string,
        reloadCharacters: string,
        characterManager: string,
    },
    log: {
        interactionCreateEvent: string,
        messageCreateEvent: string
    }
}