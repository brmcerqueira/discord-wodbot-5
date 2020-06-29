export type ConfigDef = {
    discordToken: string,
    storytellerId: string,
    googleSheets: {
        clientId: string,
        clientSecret: string,
        apiKey: string
    }
    sheets: { 
        [key: string]: string 
    }
}