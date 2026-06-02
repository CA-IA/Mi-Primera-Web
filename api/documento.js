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