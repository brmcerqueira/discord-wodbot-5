// deno-lint-ignore-file
import { labels } from "./i18n/labels.ts";
import { config } from "./config.ts";
import { logger } from "./logger.ts";
import { jsonResponse } from "./utils/jsonResponse.ts";
import { serve } from "./deps.ts";

export module googleSheets {
    
    const spreadSheetsApi = "https://sheets.googleapis.com/v4/spreadsheets";
    let token: any = null;

    export function auth(): Promise<void> {
        return new Promise<void>(result => {
            if (token) {
                result(token);
            }
            else {                 
                async function handleHttp() {
                    const conn = Deno.listen({ port: 3000 });
                    const httpServer = Deno.serveHttp(await conn.accept());
            
                    for await (const event of httpServer) {
                        let urlSearchParams = new URLSearchParams(event.request.url.substring(1));
                        if (urlSearchParams.has("code")) {
                            event.respondWith(Response.json(labels.closeThisFlap));
                            let postParams = new URLSearchParams();
                            postParams.append("code", <string> urlSearchParams.get("code"));
                            postParams.append("grant_type", "authorization_code");
                            postParams.append("client_id", config.googleSheets.clientId);
                            postParams.append("client_secret", config.googleSheets.clientSecret);
                            postParams.append("redirect_uri", "http://localhost:3000");

                            fetch("https://oauth2.googleapis.com/token", { 
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/x-www-form-urlencoded"
                                },
                                body: postParams
                            }).then(jsonResponse).then(data => {
                                httpServer.close();
                                token = data;
                                logger.info(labels.authSuccess);
                                result();
                            }).catch(response => {
                                logger.error(response);
                            });          
                        }
                        else {
                            event.respondWith(Response.error());
                        }
                    }
                }
            
                handleHttp();
            
                let authParams = new URLSearchParams();
                authParams.append("access_type", "offline");
                authParams.append("response_type", "code");
                authParams.append("client_id", config.googleSheets.clientId);
                authParams.append("scope", "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/spreadsheets.readonly");
                authParams.append("redirect_uri", "http://localhost:3000"); 
            
                logger.info(labels.urlAuth, `https://accounts.google.com/o/oauth2/auth?${authParams}`);
            }
        });
    }

    export type MajorDimensionType = "DIMENSION_UNSPECIFIED" | "ROWS" | "COLUMNS";

    export type ValuesBatchGetResult = { 
        spreadsheetId: string,
        valueRanges: {
            range: string,
            majorDimension: string,
            values: string[][]
        }[]
    };

    export function valuesBatchGet(spreadSheetId: string, 
        majorDimension: MajorDimensionType, 
        ranges: string[]): Promise<ValuesBatchGetResult> {               

        let params = new URLSearchParams();
        params.append("key", config.googleSheets.apiKey);
        params.append("majorDimension", majorDimension);

        for (const item of ranges) {
            params.append("ranges", item);
        }
        
        return fetch(`${spreadSheetsApi}/${spreadSheetId}/values:batchGet?${params}`, { 
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token.access_token}`
            }
        }).then(jsonResponse);
    }

    export type ValuesUpdateBody = {
        majorDimension: MajorDimensionType,
        values: any[][]
    }

    export function valuesUpdate(spreadSheetId: string, 
        range: string, 
        valueInputOption: "INPUT_VALUE_OPTION_UNSPECIFIED" | "RAW" | "USER_ENTERED", 
        body: ValuesUpdateBody): Promise<any> {

        let params = new URLSearchParams();
        params.append("key", config.googleSheets.apiKey);
        params.append("valueInputOption", valueInputOption);
        
        return fetch(`${spreadSheetsApi}/${spreadSheetId}/values/${encodeURI(range)}?${params}`, { 
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.access_token}`               
            },
            body: JSON.stringify(body)
        }).then(jsonResponse);
    }
}