import { generarContenidoGemini } from './gemini.js';

export default async function handler(req, res) {

    try {

        const { norma } = req.body;

        if(!norma){

            return res.status(400).json({
                error: "Norma no recibida"
            });

        }

        const prompt = `
Eres experto en normas ISO.

Genera un documento técnico completo sobre ${norma}.

No utilices Markdown.
No utilices símbolos #, ## o ###.
Escribe títulos y subtítulos en texto normal.

Incluye:

- Introducción
- Objeto y alcance
- Requisitos principales
- Desarrollo de cada capítulo
- Ejemplos prácticos
- Beneficios
- Conclusiones

Entre 3000 y 5000 palabras.
`;

        const datos = await generarContenidoGemini(prompt);

        console.log("RESPUESTA GEMINI:", JSON.stringify(datos, null, 2));

        const texto =
            datos.candidates?.[0]?.content?.parts?.[0]?.text;

        if(!texto){

            return res.status(500).json({
                error: "Gemini no devolvió contenido"
            });

        }

        return res.status(200).json({
            documento: texto
        });

    }
    catch(error){

        console.error(error);

        return res.status(500).json({
            error: error.message
        });

    }

}