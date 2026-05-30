export default async function handler(req, res) {

    try {

        if(req.method !== "POST"){

            return res.status(405).json({
                error: "Método no permitido"
            });

        }

        const { norma } = req.body;

        if(!norma){

            return res.status(400).json({
                error: "Norma no recibida"
            });

        }

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
                            sistemas de gestión,
                            calidad y auditorías.
                            `
                        },

                        {
                            role: "user",

                            content:
                            `
                            Genera un resumen técnico
                            de aproximadamente 1000 caracteres
                            sobre la norma ${norma}.

                            Después genera un mapa conceptual
                            completo en texto ASCII.

                            El formato debe ser EXACTAMENTE:

                            RESUMEN:
                            texto...

                            MAPA:
                            esquema...
                            `
                        }

                    ],

                    temperature: 0.7

                })

            }

        );

        const datos = await respuesta.json();

        console.log(datos);

        if(datos.error){

            return res.status(500).json({
                error: datos.error.message
            });

        }

        const texto =
            datos.choices[0].message.content;

        return res.status(200).json({
            resultado: texto
        });

    }

    catch(error){

        console.error(error);

        return res.status(500).json({
            error: "Error interno servidor"
        });

    }

}