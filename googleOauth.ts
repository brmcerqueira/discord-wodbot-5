import { soxa } from "soxa/mod.ts";
import { serve } from "http/server.ts";
import { Logger } from "log4deno/index.ts";
import { ConfigDef } from "./configDef.ts";
import { labels } from "./i18n/labels.ts";

let token: any = null;

export function loadToken(logger: Logger, config: ConfigDef): Promise<string> {
    return new Promise<string>(result => {
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
                        postParams.append("client_id", config.googleOauth.clientId);
                        postParams.append("client_secret", config.googleOauth.clientSecret);
                        postParams.append("redirect_uri", "http://localhost:3000");        
                        soxa.post("https://oauth2.googleapis.com/token", postParams.toString(), {
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            }                
                        }).then(response => {
                            httpServer.close();
                            token = response.data;
                            logger.info(labels.authSuccess);
                            result(token);
                        }).catch(response => {
                            logger.error(response);
                        })               
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
            authParams.append("client_id", config.googleOauth.clientId);
            authParams.append("scope", "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/spreadsheets.readonly");
            authParams.append("redirect_uri", "http://localhost:3000"); 
        
            logger.info(labels.urlAuth, `https://accounts.google.com/o/oauth2/auth?${authParams}`);
        }
    });
}