export type DicePoolType = {
    name: string,
    description: string,
}

export type LabelsType = {
    urlAuth: string,
    authSuccess: string,
    closeThisFlap: string,
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
    jsonResponseError: string,
    loading: string,
    dicePools: {
        attackWithFists: DicePoolType
    },
    commands: {
        setDifficulty: string,
        reloadCharacters: string,
        addExperience: string,
        decreaseExperience: string,
        changeCharacterOption: string,
        setHunger: string
    },
    log: {
        interactionCreateEvent: string,
        messageCreateEvent: string
    }
}