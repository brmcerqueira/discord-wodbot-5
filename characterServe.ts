import { charactersPath, outPath } from "./config.ts";
import { base64url } from "./deps.ts";
import { index } from "./index.tsx";

const etags: {
    [id: string]: string
} = {};

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export async function start(): Promise<void> {
    const connection = Deno.listen({ port: 3000 });
    const httpServer = Deno.serveHttp(await connection.accept());

    for await (const event of httpServer) {
        const url = new URL(event.request.url);
   
        if (url.pathname == "/character" && url.searchParams.has("id")) {
            const id = decodeBase64(url.searchParams.get("id")!);

            if (etags[id] && event.request.headers.has("If-None-Match") && event.request.headers.get("If-None-Match") == etags[id]) {
                await event.respondWith(new Response(null, {
                    status: 304
                }));
            }
            else {
                try {
                    etags[id] = new Date().getTime().toString();

                    await event.respondWith(new Response(await Deno.readFile(`${outPath}/${id}.pdf`), {
                        status: 200,
                        headers: {
                            "Content-Type": "application/pdf",
                            ETag: etags[id]
                        }
                    }));
                } catch (_error) {
                    await respond404(event);
                }
            }
        }
        else if (url.pathname == "/check" && url.searchParams.has("id")) {
            await event.respondWith(Response.json({ update: !etags[decodeBase64(url.searchParams.get("id")!)] }));
        }
        else if (url.pathname == "/template") {
            await event.respondWith(new Response(await Deno.readFile("./pdf/template.pdf"), {
                status: 200,
                headers: {
                    "Content-Type": "application/pdf"
                }
            }));
        }
        else if (url.searchParams.has("id")) {
            await event.respondWith(new Response(textEncoder.encode(await index({ 
                id: url.searchParams.get("id")!
            }).render())));
        }  
        else {
            await respond404(event);
        }
    }
}

export async function buildLightPdf(userId: string, file: string) {
    await Deno.run({ cmd: ["ghostscript",
    "-sDEVICE=pdfwrite",
    "-dCompatibilityLevel=1.6",
    "-dPDFSETTINGS=/printer",
    "-dNOPAUSE",
    "-dQUIET",
    "-dBATCH",
    `-sOutputFile=${outPath}/${userId}.pdf`,
    `${charactersPath}/${file}`] 
    }).status();
    delete etags[userId];
}

function decodeBase64(data: string): string {
    return textDecoder.decode(base64url.decode(data));
}

async function respond404(event: Deno.RequestEvent) {
  await event.respondWith(new Response(null, {
    status: 404
  }));
}