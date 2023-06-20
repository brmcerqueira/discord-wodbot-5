import { charactersPath, outPath } from "./config.ts";
import { index } from "./index.tsx";

const etags: {
    [id: string]: string
} = {};

export async function start(): Promise<void> {
    const connection = Deno.listen({ port: 3000 });
    const httpServer = Deno.serveHttp(await connection.accept());

    for await (const event of httpServer) {
        const url = new URL(event.request.url);
   
        const textEncoder = new TextEncoder();

        if (url.pathname == "/character" && url.searchParams.has("id")) {
            const id = url.searchParams.get("id")!;

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
            await event.respondWith(Response.json({ update: !etags[url.searchParams.get("id")!] }));
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

async function respond404(event: Deno.RequestEvent) {
  await event.respondWith(new Response(null, {
    status: 404
  }));
}