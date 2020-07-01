import { serve } from "http/server.ts";
import { labels } from "./i18n/labels.ts";
import { config } from "./config.ts";
import { logger } from "./logger.ts";
import { jsonResponse } from "./utils/jsonResponse.ts";

export module googleSheets {
    let token: any = null;

    export function auth(): Promise<void> {
        return new Promise<void>(result => {
            if (token) {
                result(token);
            }
            else {
                async function codeHandle() {
                    let httpServer = serve({ port: 3000 });
            
                    for await (let request of httpServer) {
                        let urlSearchParams = new URLSearchParams(request.url.substring(1));
                        if (urlSearchParams.has("code")) {
                            request.respond({ status: 200, body: labels.closeThisFlap });
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
                            request.respond({ status: 404 });
                        }
                    }
                }
            
                codeHandle();
            
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

    export enum ValuesBatchGetMajorDimension {
        DimensionUnspecified,
        Rows,
        Columns
    };

    export type ValuesBatchGetResult = { 
        spreadsheetId: string,
        valueRanges: {
            range: string,
            majorDimension: string,
            values: string[][]
        }[]
    };

    export function valuesBatchGet(spreadSheetId: string, majorDimension: ValuesBatchGetMajorDimension, ranges: string[]): Promise<ValuesBatchGetResult> {               
        let majorDimensionValue: string;
        switch (majorDimension) {
            case ValuesBatchGetMajorDimension.DimensionUnspecified:
                majorDimensionValue = "DIMENSION_UNSPECIFIED"
                break;
            case ValuesBatchGetMajorDimension.Rows:
                majorDimensionValue = "ROWS"
                break;
            case ValuesBatchGetMajorDimension.Columns:
                majorDimensionValue = "COLUMNS"
                break;                
        }

        let params = new URLSearchParams();
        params.append("key", config.googleSheets.apiKey);
        params.append("majorDimension", majorDimensionValue);

        for (const item of ranges) {
            params.append("ranges", item);
        }
        
        return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadSheetId}/values:batchGet?${params}`, { 
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token.access_token}`
            }
        }).then(jsonResponse);
    }
}