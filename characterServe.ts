import { charactersPath, outPath } from "./config.ts";

const etags: {
    [id: string]: string
} = {};

export async function start(): Promise<void> {
    const connection = Deno.listen({ port: 3000 });
    const httpServer = Deno.serveHttp(await connection.accept());

    for await (const event of httpServer) {
        const url = new URL(event.request.url);
   
        if (url.searchParams.has("id")) {
            const id = url.searchParams.get("id")!;

            let headers: HeadersInit | undefined = undefined;

            if (url.searchParams.has("refresh")) {
                headers = {
                    Refresh: url.searchParams.get("refresh")!
                }
            }

            if (etags[id] && event.request.headers.has("If-None-Match") && event.request.headers.get("If-None-Match") == etags[id]) {
                await event.respondWith(new Response(null, {
                    status: 304,
                    headers: headers
                }));
            }
            else {
                try {
                    if (!headers) {
                        headers = {};
                    }

                    headers["Content-Type"] = "application/pdf";
                    headers.ETag = new Date().getTime().toString();

                    etags[id] = headers.ETag;

                    await event.respondWith(new Response(await Deno.readFile(`${outPath}/${id}.pdf`), {
                        status: 200,
                        headers: headers
                    }));
                } catch (_error) {
                    await respond404(event);
                }
            }
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