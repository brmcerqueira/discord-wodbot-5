import { labels } from "./i18n/labels.ts";
import { config } from "./config.ts";
import { logger } from "./logger.ts";

const driveApi = "https://www.googleapis.com";

type TokenType = {
    access_token: string,
} | null;

let token: TokenType = null;

export async function auth(): Promise<void> {
    if (!token) {
        const connection = Deno.listen({ port: 3000 });

        const authParams = new URLSearchParams();
        authParams.append("access_type", "offline");
        authParams.append("response_type", "code");
        authParams.append("client_id", config.googleDrive.clientId);
        authParams.append("scope", "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly");
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
                postParams.append("client_id", config.googleDrive.clientId);
                postParams.append("client_secret", config.googleDrive.clientSecret);
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

export async function download(fileId: string): Promise<ArrayBuffer | null> {
    const params = new URLSearchParams();
    params.append("alt", "media");
    const response = await fetch(`${driveApi}/drive/v3/files/${fileId}?${params}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token?.access_token}`
        }
    });

    if (response.ok) {
        try {
            return await response.arrayBuffer();
        } catch (error) {
            logger.error(error);
        }
    }

    return null;
}

export async function upload(fileId: string, file: Uint8Array) {
    const params = new URLSearchParams();
    params.append("uploadType", "media");
    await jsonResponse(await fetch(`${driveApi}/upload/drive/v3/files/${fileId}?${params}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/pdf",
            "Content-Length": file.byteLength.toString(),
            Authorization: `Bearer ${token?.access_token}`
        },
        body: file
    }));
}

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