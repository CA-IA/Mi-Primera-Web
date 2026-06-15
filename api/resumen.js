import { generarContenidoGemini } from './gemini.js';

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
- todos los subapartados relevantes
- entre 15 y 25 nodos como mínimo
- relaciones jerárquicas completas
- estructura adecuada para un mapa conceptual profesional

No hagas esquemas simples.

El mapa debe ser detallado y útil para estudiar la norma.


El formato debe ser EXACTAMENTE:

RESUMEN:
texto...


MERMAID:
Devuelve exclusivamente código Mermaid.

No utilices:

- %
- %%
- comentarios
- explicaciones
- bloques markdown

Comienza directamente por:

graph LR
Utiliza graph LR para generar diagramas horizontales.
A[Norma]
A --> B[Capítulo]
`;

        const datos = await generarContenidoGemini(prompt);

        console.log("RESPUESTA GEMINI:", JSON.stringify(datos, null, 2));

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