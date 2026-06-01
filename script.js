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

        const texto = datos.resultado;
            console.log(texto);

        const partesPDF =
            texto.split("PDF:");

        const resumenYMapa =
            partesPDF[0];

        const pdfYMermaid =
            partesPDF[1];

        const partesMermaid =
            pdfYMermaid.split("MERMAID:");

        const textoPDF =
            partesMermaid[0].trim();

        const mermaidCode =
            partesMermaid[1].trim();

        const resumen =
            resumenYMapa
                .replace("RESUMEN:","")
                .trim();

        resumenTexto.innerHTML =
            resumen;
        
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
            "Error conectando con IA.";

    }

}

window.addEventListener("load", () => {

    const cerrar =
        document.getElementById("cerrarMapa");

    if(cerrar){

        cerrar.addEventListener("click", () => {

            document.getElementById("modalMapa")
                .style.display = "none";

        });

    }

});