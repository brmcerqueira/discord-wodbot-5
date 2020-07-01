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
    dicePools: {
        attackWithFists: DicePoolType
    }
}