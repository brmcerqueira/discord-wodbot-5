export type ConfigDef = {
    discordToken: string,
    storytellerId: string,
    googleSheets: {
        clientId: string,
        clientSecret: string,
        apiKey: string
    }
    sheets: { 
        commandsChannelId: string,
        outputChannelId: string,
        characters: { 
            [key: string]: string[]
        } 
    }
}