import { jsonResponse } from "./utils/jsonResponse.ts";

export module discord {
    const api = "https://discord.com/api/v6";

    let headers: HeadersInit = {};

    export type MessageResult = {
        id: string
    }

    export function setToken(token: string): void {
        headers = {
            "Content-Type": "application/json",
            Authorization: `Bot ${token}`
        }
    }  

    export function bulkDeleteMessages(channelId: string, messageIds: string[]): Promise<MessageResult[]> {
        return fetch(`${api}/channels/${channelId}/messages/bulk-delete`, { 
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                messages: messageIds
            })
        }).then(jsonResponse)
    }

    export function getAllMessages(channelId: string): Promise<MessageResult[]> {
        return fetch(`${api}/channels/${channelId}/messages`, { 
            method: "GET",
            headers: headers
        }).then(jsonResponse);
    }

    export function deleteAllReactions(channelId: string, messageId: string): Promise<boolean> {
        return fetch(`${api}/channels/${channelId}/messages/${messageId}/reactions`, { 
            method: "DELETE",
            headers: headers
        }).then(jsonResponse).then(() => Promise.resolve(true)).catch(() => Promise.resolve(false));
    }
}