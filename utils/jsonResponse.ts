import { logger } from "../logger.ts";

export function jsonResponse(response: Response): Promise<any> {
    if (response.ok) {
        return response.json().catch(() => Promise.resolve(null));
    }
    else {
        return response.text().then(text => {
            logger.error(response.status, response.statusText, response.url, text);
            return Promise.reject(response.statusText);
        });        
    }
}