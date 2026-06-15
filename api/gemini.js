function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function generarContenidoGemini(prompt) {
    const modelos = [
        "gemini-3.5",
        "gemini-3-flash-preview"
    ];

    const maxReintentos = 2;
    let ultimoError = null;

    for (const modelo of modelos) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${process.env.GEMINI_API_KEY}`;

        for (let intento = 0; intento <= maxReintentos; intento++) {
            try {
                const respuesta = await fetch(url, {
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
                });

                const datos = await respuesta.json().catch(() => null);

                if (!respuesta.ok) {
                    const mensaje = datos?.error?.message || `Error HTTP ${respuesta.status}`;
                    const esTransitorio = [429, 503, 504].includes(respuesta.status) ||
                        mensaje.toLowerCase().includes("high demand") ||
                        mensaje.toLowerCase().includes("temporarily unavailable") ||
                        mensaje.toLowerCase().includes("rate limit");

                    if (esTransitorio && intento < maxReintentos) {
                        const espera = 800 * Math.pow(2, intento);
                        console.log(`Reintentando ${modelo} (intento ${intento + 1}/${maxReintentos}) después de ${espera}ms`);
                        await sleep(espera);
                        continue;
                    }

                    ultimoError = new Error(`Modelo ${modelo}: ${mensaje}`);
                    break;
                }

                if (datos?.error) {
                    const mensaje = datos.error.message || JSON.stringify(datos.error);
                    const esTransitorio = mensaje.toLowerCase().includes("high demand") ||
                        mensaje.toLowerCase().includes("temporarily unavailable") ||
                        mensaje.toLowerCase().includes("rate limit");

                    if (esTransitorio && intento < maxReintentos) {
                        const espera = 800 * Math.pow(2, intento);
                        console.log(`Reintentando ${modelo} (intento ${intento + 1}/${maxReintentos}) después de ${espera}ms`);
                        await sleep(espera);
                        continue;
                    }

                    ultimoError = new Error(`Modelo ${modelo}: ${mensaje}`);
                    break;
                }

                console.log(`Éxito con modelo: ${modelo}`);
                return datos;
            }
            catch (error) {
                const mensaje = error?.message || String(error);

                if (intento < maxReintentos) {
                    const espera = 800 * Math.pow(2, intento);
                    console.log(`Reintentando ${modelo} (intento ${intento + 1}/${maxReintentos}) después de ${espera}ms`);
                    await sleep(espera);
                    continue;
                }

                ultimoError = new Error(`Modelo ${modelo}: ${mensaje}`);
                break;
            }
        }

        if (ultimoError) {
            console.warn(`Intento de modelo ${modelo} fallido: ${ultimoError.message}`);
        }
    }

    throw ultimoError || new Error("No se pudo generar contenido con Gemini.");
}
