import { labels } from "./i18n/labels.ts";
import { config } from "./config.ts";
import { logger } from "./logger.ts";

const spreadSheetsApi = "https://sheets.googleapis.com/v4/spreadsheets";

type TokenType = {
    access_token: string,
} | null;

let token: TokenType = null;

async function jsonResponse<T>(response: Response): Promise<T | null> {
    if (response.ok) {
        try {
            return await response.json();
        } catch (error) {
            logger.error(error);
        }
    }
    else {
        const text = await response.text();
        logger.error(labels.jsonResponseError, response.status, response.statusText, response.url, text);
    }
    return null;
}

export async function auth(): Promise<void> {
    if (!token) {
        const connection = Deno.listen({ port: 3000 });

        const authParams = new URLSearchParams();
        authParams.append("access_type", "offline");
        authParams.append("response_type", "code");
        authParams.append("client_id", config.googleSheets.clientId);
        authParams.append("scope", "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/spreadsheets.readonly");
        authParams.append("redirect_uri", "http://localhost:3000");

        logger.info(labels.urlAuth, `https://accounts.google.com/o/oauth2/auth?${authParams}`);

        const httpServer = Deno.serveHttp(await connection.accept());

        for await (const event of httpServer) {
            const url = new URL(event.request.url);
            if (url.searchParams.has("code")) {
                await event.respondWith(Response.json(labels.closeThisFlap, { status: 200 }));
                const postParams = new URLSearchParams();
                postParams.append("code", <string>url.searchParams.get("code"));
                postParams.append("grant_type", "authorization_code");
                postParams.append("client_id", config.googleSheets.clientId);
                postParams.append("client_secret", config.googleSheets.clientSecret);
                postParams.append("redirect_uri", "http://localhost:3000");
                try {
                    const data = await jsonResponse<TokenType>(await fetch("https://oauth2.googleapis.com/token", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        body: postParams
                    }));
                    token = data;
                    httpServer.close();
                    connection.close();
                    logger.info(labels.authSuccess);
                } catch (error) {
                    logger.error(error);
                }
            }
            else {
                await event.respondWith(Response.json({}, { status: 404 }));
            }
        }
    }
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

export async function valuesBatchGet(spreadSheetId: string,
    majorDimension: MajorDimensionType,
    ranges: string[]): Promise<ValuesBatchGetResult | null> {

    const params = new URLSearchParams();
    params.append("key", config.googleSheets.apiKey);
    params.append("majorDimension", majorDimension);

    for (const item of ranges) {
        params.append("ranges", item);
    }

    return await jsonResponse(await fetch(`${spreadSheetsApi}/${spreadSheetId}/values:batchGet?${params}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token?.access_token}`
        }
    }));
}

export type ValuesUpdateBody = {
    majorDimension: MajorDimensionType,
    values: any[][]
}

export async function valuesUpdate(spreadSheetId: string,
    range: string,
    valueInputOption: "INPUT_VALUE_OPTION_UNSPECIFIED" | "RAW" | "USER_ENTERED",
    body: ValuesUpdateBody) {

    const params = new URLSearchParams();
    params.append("key", config.googleSheets.apiKey);
    params.append("valueInputOption", valueInputOption);

    await jsonResponse(await fetch(`${spreadSheetsApi}/${spreadSheetId}/values/${encodeURI(range)}?${params}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token?.access_token}`
        },
        body: JSON.stringify(body)
    }));
}