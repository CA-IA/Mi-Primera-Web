async function generarResumen(){

    const norma =
        document.getElementById("normaInput").value;

    const resumenTexto =
        document.getElementById("resumenTexto");
    
    const pdfContainer =
        document.getElementById("pdfContainer");

    const mapaConceptual =
        document.getElementById("mapaConceptual");

    const mapaVisual =
        document.getElementById("mapaVisual");

    if(norma === ""){

        resumenTexto.innerHTML =
            "Introduce una norma.";

        return;
    }

    resumenTexto.innerHTML =
        "Generando resumen con IA...";

    mapaConceptual.innerHTML = "";
    mapaVisual.innerHTML = "";

    try{

        const respuesta = await fetch(
            "/api/resumen",
            {
                method: "POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body: JSON.stringify({
                    norma: norma
                })
            }
        );

        const datos = await respuesta.json();

            console.log("RESPUESTA API:");
            console.log(datos);

            if(!respuesta.ok){

                throw new Error(
                    datos.error || "Error API"
                );

            }

        const texto = datos.resultado;

            if(!texto){

                throw new Error(
                    "La API no devolvió resultado"
                );

            }

        const partesMermaid =
            texto.split("MERMAID:");

        if(partesMermaid.length < 2){

            resumenTexto.innerHTML =
                "La IA no generó el mapa conceptual.";

            console.error(texto);

            return;
        }

        const resumen =
            partesMermaid[0]
                .replace("RESUMEN:","")
                .trim();

        let mermaidCode =
            partesMermaid[1].trim();
        
        mermaidCode =
            mermaidCode
                .replace(/```mermaid/g, "")
                .replace(/```/g, "")
                .trim();

        mermaidCode =
            mermaidCode
                .split("\n")
                .filter(linea =>
                    !linea.trim().startsWith("%")
                )
                .join("\n");

        console.log("MERMAID LIMPIO:");
        console.log(mermaidCode);

        
        resumenTexto.innerHTML =
            resumen;
        
        document.getElementById("zonaDocumento")
            .style.display = "block";
                
        const pdfContainer =
            document.getElementById("pdfContainer");

        pdfContainer.style.display =
            "block";

        document.getElementById("btnPDF").onclick =
            function(){

                const { jsPDF } = window.jspdf;

                const pdf =
                    new jsPDF();

                const lineas =
                    pdf.splitTextToSize(
                        textoPDF,
                        180
                    );

                let y = 20;

                lineas.forEach(linea => {

                    if(y > 270){

                        pdf.addPage();
                        y = 20;

                    }

                    pdf.text(
                        linea,
                        15,
                        y
                    );

                    y += 7;

                });

                pdf.output("dataurlnewwindow");

            };

        document.getElementById("btnAudio").onclick =
            function(){

                speechSynthesis.cancel();

                const lectura =
                    new SpeechSynthesisUtterance(
                        textoPDF
                    );

                lectura.lang = "es-ES";

                lectura.rate = 1;

                speechSynthesis.speak(
                    lectura
                );

            };

        document.getElementById("btnPausa").onclick =
            function(){

                if(speechSynthesis.speaking){

                    if(speechSynthesis.paused){

                        speechSynthesis.resume();

                        this.innerHTML =
                            "⏸ Pausar";

                    }else{

                        speechSynthesis.pause();

                        this.innerHTML =
                            "▶ Continuar";

                    }

                }

            };

        document.getElementById("btnStop").onclick =
            function(){

                speechSynthesis.cancel();

                document.getElementById("btnPausa").innerHTML =
                    "⏸ Pausar";

            };

        mapaConceptual.innerHTML =
            "Diagrama generado por IA";

        mapaVisual.innerHTML =
            `<pre class="mermaid">${mermaidCode}</pre>`;

        await window.mermaid.run();

        const contenedor =
            document.getElementById("mapaVisual");

        contenedor.onclick = function(){

        document.getElementById("modalMapa").style.display =
            "block";

        document.getElementById("mapaGrande").innerHTML =
            `<pre class="mermaid">${mermaidCode}</pre>`;

        window.mermaid.run();
        };


    }

    catch(error){

        console.error(error);

        resumenTexto.innerHTML =
            error.message;

    }

}

window.addEventListener("load", () => {

    const btnDocumento =
        document.getElementById(
            "btnGenerarDocumento"
        );

    if(btnDocumento){

        btnDocumento.onclick =
            generarDocumento;

    }

    const cerrar =
        document.getElementById("cerrarMapa");

    if(cerrar){

        cerrar.addEventListener("click", () => {

            document.getElementById("modalMapa")
                .style.display = "none";

        });

    }

});

async function generarDocumento(){

    const norma =
        document.getElementById("normaInput").value;

    const boton =
        document.getElementById("btnGenerarDocumento");

    boton.innerHTML =
        "Generando documento...";

    const respuesta = await fetch(
        "/api/documento",
        {
            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                norma:norma
            })
        }
    );

    const datos =
        await respuesta.json();

    const textoPDF =
        datos.documento;

    window.documentoCompleto =
        textoPDF;

    boton.innerHTML =
        "✅ Documento generado";

    pdfContainer.style.display =
        "block";
}