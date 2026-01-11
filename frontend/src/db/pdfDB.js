import Dexie from "dexie";

export const pdfDB = new Dexie("PDF_Database");

pdfDB.version(1).stores({
    pdfs: "++id, name, size, uploadedAt"
});
