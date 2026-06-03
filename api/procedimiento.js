export default async function handler(req, res) {

    try {

        if(req.method !== "POST"){

            return res.status(405).json({
                error: "Método no permitido"
            });

        }

        const { norma, tematica } = req.body;

        if(!norma || !tematica){

            return res.status(400).json({
                error: "Norma o temática no recibida"
            });

        }

        const prompt = `
Eres experto en sistemas de gestión, normas ISO, calidad, medioambiente y auditorías.

Genera un procedimiento documentado sobre la temática "${tematica}" que cumpla la norma "${norma}".

No utilices Markdown.
No utilices símbolos #, ## o ###.
Escribe títulos y subtítulos en texto normal.

El procedimiento debe ser aplicable en una organización real e incluir:

- Título del procedimiento
- Código del documento
- Versión
- Fecha
- Objeto
- Alcance
- Referencias normativas
- Definiciones
- Responsabilidades
- Desarrollo del procedimiento paso a paso
- Registros y evidencias
- Indicadores de seguimiento
- Riesgos y controles asociados
- Anexos o formatos sugeridos
- Control de cambios

Redacta el contenido de forma formal, clara y profesional.
Debe estar alineado con los requisitos de la norma indicada.
Extensión aproximada: entre 1800 y 3000 palabras.
`;

        const respuesta = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const datos =
            await respuesta.json();

        console.log(
            JSON.stringify(datos, null, 2)
        );

        if(datos.error){

            return res.status(500).json({
                error: datos.error.message
            });

        }

        const texto =
            datos.candidates?.[0]?.content?.parts?.[0]?.text;

        if(!texto){

            return res.status(500).json({
                error: "Gemini no devolvió contenido"
            });

        }

        return res.status(200).json({
            procedimiento: texto
        });

    }
    catch(error){

        console.error(error);

        return res.status(500).json({
            error: error.message
        });

    }

}
