function generarResumen(){

    const norma =
        document.getElementById("normaInput").value;

    const resultado =
        document.getElementById("resultadoIA");

    if(norma === ""){

        resultado.innerHTML =
            "<p>Introduce una norma ISO.</p>";

        return;
    }

    let resumen = "";
    let mapa = "";

    if(norma.toLowerCase().includes("9001")){

        resumen =
        "ISO 9001 es una norma internacional " +
        "de gestión de calidad centrada en " +
        "la mejora continua y satisfacción " +
        "del cliente.";

        mapa =
        `
ISO 9001
│
├── Contexto organización
├── Liderazgo
├── Riesgos
├── Auditorías
└── Mejora continua
        `;
    }

    else if(norma.toLowerCase().includes("14001")){

        resumen =
        "ISO 14001 establece requisitos " +
        "para sistemas de gestión ambiental.";

        mapa =
        `
ISO 14001
│
├── Impacto ambiental
├── Sostenibilidad
├── Control operacional
├── Emergencias
└── Mejora ambiental
        `;
    }

    else if(norma.toLowerCase().includes("17025")){

        resumen =
        "ISO 17025 regula la competencia " +
        "técnica de laboratorios de ensayo " +
        "y calibración.";

        mapa =
        `
ISO 17025
│
├── Competencia técnica
├── Equipos
├── Calibraciones
├── Validación métodos
└── Trazabilidad
        `;
    }

    else{

        resumen =
        "Norma no encontrada todavía " +
        "en la demo.";

        mapa =
        `
Norma
│
└── Información pendiente
        `;
    }

    resultado.innerHTML = `

        <h3>Resumen</h3>

        <p>${resumen}</p>

        <h3>Mapa conceptual</h3>

        <pre>${mapa}</pre>

    `;
}
