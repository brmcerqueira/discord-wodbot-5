import { jsonResponse } from "./jsonResponse.ts";

export module discord {
    const api = "https://discord.com/api/v6";

    let headers: HeadersInit = {};

    export function setToken(token: string): void {
        headers = {
            "Content-Type": "application/json",
            Authorization: `Bot ${token}`
        }
    }  
    
    export function deleteAllMessages(channelId: string): Promise<boolean> {
        return fetch(`${api}/channels/${channelId}/messages`, { 
            method: "GET",
            headers: headers
        }).then(jsonResponse).then((data: any[]) => {
            switch (data.length) {
                case 0:
                    return Promise.resolve(false);
                case 1:
                    return fetch(`${api}/channels/${channelId}/messages/${data[0].id}`, { 
                        method: "DELETE",
                        headers: headers
                    }).then(jsonResponse).then(() => Promise.resolve(true));       
                default:
                    return fetch(`${api}/channels/${channelId}/messages/bulk-delete`, { 
                        method: "POST",
                        headers: headers,
                        body: JSON.stringify({
                            messages: data.map(m => m.id)
                        })
                    }).then(jsonResponse).then(() => Promise.resolve(true)); 
            }
        });
    }

    export function deleteAllReactions(channelId: string, messageId: string): Promise<boolean> {
        return fetch(`${api}/channels/${channelId}/messages/${messageId}/reactions`, { 
            method: "DELETE",
            headers: headers
        }).then(jsonResponse).then(() => Promise.resolve(true)).catch(() => Promise.resolve(false));
    }
}