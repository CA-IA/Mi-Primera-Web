export default async function handler(req, res) {

    try {

        if (req.method !== "POST") {

            return res.status(405).json({
                error: "Método no permitido"
            });

        }

        const { norma } = req.body;

        if (!norma) {

            return res.status(400).json({
                error: "Norma no recibida"
            });

        }

        const prompt = `
Eres experto en normas ISO, sistemas de gestión,
calidad, medioambiente y auditorías.

Genera un resumen técnico de aproximadamente
1000 caracteres sobre la norma ${norma}.

El resumen debe destacar:

- objetivo de la norma
- requisitos principales
- beneficios
- apartados más relevantes

Después genera un mapa conceptual
en formato Mermaid.

Debe contener:

- todos los capítulos principales
- los subapartados más importantes
- una estructura jerárquica clara

El formato debe ser EXACTAMENTE:

RESUMEN:
texto...

MERMAID:
graph TD
A[Norma]
A --> B[Capítulo]
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

        const datos = await respuesta.json();

        console.log(JSON.stringify(datos, null, 2));

        if (datos.error) {

            return res.status(500).json({
                error: datos.error.message
            });

        }

        const texto =
            datos.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!texto) {

            return res.status(500).json({
                error: "Gemini no devolvió contenido"
            });

        }

        return res.status(200).json({
            resultado: texto
        });

    }
    catch (error) {

        console.error(error);

        return res.status(500).json({
            error: "Error interno servidor"
        });

    }

}