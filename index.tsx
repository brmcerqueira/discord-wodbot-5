import React, { TsxComplexElement } from "./deps.ts";

export const index = (prop: { id: string }): TsxComplexElement => (
  <html>
  <head>
    <title>Character</title>
    <style>{'body { margin: 0% }'}</style>
    <script>{`
        setInterval(async () => {
          const response = await fetch("check?id=${prop.id}", {
              method: "GET"
          });
      
          const data = await response.json();
      
          if (data.update) {
              const pdf = document.getElementById("pdf");
              pdf.data = pdf.data;
          }
      }, 5000);
    `}</script>
  </head>
  <body>
    <object id="pdf" data={`character?id=${prop.id}`} type="application/pdf" width="100%" height="100%"/>
  </body>
  </html>
);