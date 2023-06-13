import { labels } from "../i18n/labels.ts";
import { logger } from "../logger.ts";

export function jsonResponse(response: Response): Promise<any> {
    if (response.ok) {
        return response.json().catch(() => Promise.resolve(null));
    }
    else {
        return response.text().then(text => {
            logger.error(labels.jsonResponseError, response.status, response.statusText, response.url, text);
            return Promise.reject(response.statusText);
        });        
    }
}