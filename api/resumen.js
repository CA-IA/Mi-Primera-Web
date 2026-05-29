export default async function handler(req, res) {

    try {

        const { norma } = req.body;

        const respuesta = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization":
                        `Bearer ${process.env.OPENAI_API_KEY}`
                },

                body: JSON.stringify({

                    model: "gpt-4.1-mini",

                    messages: [

                        {
                            role: "system",

                            content:
                            `
                            Eres experto en normas ISO,
                            calidad, medioambiente,
                            auditorías y compliance.
                            `
                        },

                        {
                            role: "user",

                            content:
                            `
                            Genera:

                            1. Un resumen de 1000 caracteres
                            de la norma ${norma}

                            2. Un mapa conceptual completo
                            en formato esquema ASCII.

                            El formato debe ser:

                            RESUMEN:
                            ...

                            MAPA:
                            ...
                            `
                        }

                    ]

                })

            }
        );

        const datos = await respuesta.json();

        const texto =
            datos.choices[0].message.content;

        res.status(200).json({
            resultado: texto
        });

    }

    catch(error){

        res.status(500).json({
            error: "Error generando contenido"
        });

    }

}