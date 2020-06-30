export type CommandsDef = {
    [key: string]: {
        [emoji: string]: {
            name: string
        }
    }
}

export const commands: CommandsDef = {
    test: {
        '1️⃣': {
            name: "um"
        },
        '2️⃣': {
            name: "dois"
        },
        '3️⃣': {
            name: "tres"
        },
    }
}