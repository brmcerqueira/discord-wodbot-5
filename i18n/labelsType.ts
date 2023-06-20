export type DicePoolType = {
    name: string,
    description: string,
}

export type LabelsType = {
    authSuccess: string,
    welcome: string,
    dices: string,
    difficulty: string,
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
    changeCharacterSuccess: string,
    loadCharacterSuccess: string,
    updateExperienceSuccess: string,
    updateHungerSuccess: string,
    currentCharacter: string,
    loading: string,
    openYourCharacter: string,
    dicePools: {
        attackWithFists: DicePoolType
    },
    commands: {
        setDifficulty: string,
        reloadCharacters: string,
        addExperience: string,
        decreaseExperience: string,
        characterManager: string,
        setHunger: string
    },
    log: {
        interactionCreateEvent: string,
        messageCreateEvent: string
    }
}