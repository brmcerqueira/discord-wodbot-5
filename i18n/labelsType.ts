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
    loadCharacterError: string,
    uploadCharacterSuccess: string,
    uploadCharacterError: string,
    currentCharacter: string,
    loading: string,
    openYourCharacter: string,
    actions: {
        setDifficulty: string,
        setBonus: string,
        setOnus: string,
        reloadCharacters: string,
        characterManager: string,
    },
    commands: {
        roll: {
            name: string,
            description: string,
            dices: {
                name: string,
                description: string
            },
            hunger: {
                name: string,
                description: string
            },
            difficulty: {
                name: string,
                description: string
            },
            descriptionField: {
                name: string,
                description: string
            }   
        },
        uploadCharacter: {
            name: string,
            description: string,
            file: {
                name: string,
                description: string
            }
        }
    },
    dicePools: DicePoolType[]
}