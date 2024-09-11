//
// If absolute URL from the remote server is provided, configure the CORS
// header on that server.
//

//
// The workerSrc property shall be specified.
//
pdfjsLib.GlobalWorkerOptions.workerSrc =
    '../../node_modules/pdfjs-dist/build/pdf.worker.mjs';

//
// Asynchronous download PDF
//

// Fetch the first page
//

//
// Render PDF page into canvas context
//

const loadPdf = async (url) => {
    try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        const page = await pdf.numPages;


        renderPdf(pdf, page)
    } catch (error) {
        console.error('Error loading PDF:', error);
    }


}

const renderPdf = async (pdf, pageNumber) => {
    try {

        const page = await pdf.getPage(pageNumber);

        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        // Support HiDPI-screens.
        const outputScale = window.devicePixelRatio || 1;

        //
        // Prepare canvas using PDF page dimensions
        //
        const canvas = document.getElementById("the-canvas");
        const context = canvas.getContext("2d");

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height = Math.floor(viewport.height) + "px";

        const transform = outputScale !== 1
            ? [outputScale, 0, 0, outputScale, 0, 0]
            : null;
        const renderContext = {
            canvasContext: context,
            transform,
            viewport,
        };


        // const formFields = pdf.getAnnotations();
        // formFields.forEach(field => {
        //     if (field.fieldType === pdfjsLib.AnnotationFieldFlag.TYPE_TEXT) {
        //         canvas.addEventListener('click', (event) => {
        //             const rect = canvas.getBoundingClientRect();
        //             const x = (event.clientX - rect.left) * (canvas.width / rect.width);
        //             const y = (event.clientY - rect.top) * (canvas.height / rect.height);

        //             if (field.rect.includes(x, y)) {
        //                 const value = window.prompt(`Enter value for ${field.fullName}:`);
        //                 field.fieldValue = value;
        //                 renderPdf(); // Re-render the PDF after updating the field value
        //             }
        //         });
        //     }
        // });

        page.render(renderContext);




    } catch (error) {
        console.error('Error rendering PDF page:', error);
    }
}
const url = './example.pdf';

window.addEventListener('load', loadPdf(url))