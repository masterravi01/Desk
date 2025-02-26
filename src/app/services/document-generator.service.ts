import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableCell,
    TableRow,
    WidthType,
    ImageRun,
} from 'docx';

@Injectable({
    providedIn: 'root',
})
export class DocumentGeneratorService {
    constructor() { }

    async generateWordFile() {
        // Load logo image as ArrayBuffer
        const logoArrayBuffer = await this.getImageAsArrayBuffer('assets/logo.png'); // Change path as needed

        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        // Logo
                        new Paragraph({
                            children: [
                                new ImageRun({
                                    data: logoArrayBuffer, // Pass ArrayBuffer
                                    transformation: { width: 100, height: 50 }, // Adjust size
                                    type: 'png', // ✅ Corrected type
                                }),
                            ],
                            alignment: 'center',
                        }),

                        // Company Name & Address
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: 'Company Name',
                                    bold: true,
                                    size: 32, // 16pt font size
                                }),
                            ],
                            alignment: 'center',
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: '123, Street Name, City, Country - 123456',
                                    size: 24, // 12pt font size
                                }),
                            ],
                            alignment: 'center',
                        }),

                        new Paragraph({ text: '', spacing: { after: 200 } }), // Space before table

                        // Table with Full Width
                        new Table({
                            width: { size: 100, type: WidthType.PERCENTAGE }, // Make table full-width
                            rows: [
                                // Header Row
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            width: { size: 33, type: WidthType.PERCENTAGE },
                                            children: [new Paragraph({ children: [new TextRun({ text: 'ID', bold: true })] })],
                                        }),
                                        new TableCell({
                                            width: { size: 33, type: WidthType.PERCENTAGE },
                                            children: [new Paragraph({ children: [new TextRun({ text: 'Name', bold: true })] })],
                                        }),
                                        new TableCell({
                                            width: { size: 33, type: WidthType.PERCENTAGE },
                                            children: [new Paragraph({ children: [new TextRun({ text: 'Amount', bold: true })] })],
                                        }),
                                    ],
                                }),

                                // Sample Data Rows
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            width: { size: 33, type: WidthType.PERCENTAGE },
                                            children: [new Paragraph('001')],
                                        }),
                                        new TableCell({
                                            width: { size: 33, type: WidthType.PERCENTAGE },
                                            children: [new Paragraph('John Doe')],
                                        }),
                                        new TableCell({
                                            width: { size: 33, type: WidthType.PERCENTAGE },
                                            children: [new Paragraph('$500')],
                                        }),
                                    ],
                                }),
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            width: { size: 33, type: WidthType.PERCENTAGE },
                                            children: [new Paragraph('002')],
                                        }),
                                        new TableCell({
                                            width: { size: 33, type: WidthType.PERCENTAGE },
                                            children: [new Paragraph('Jane Smith')],
                                        }),
                                        new TableCell({
                                            width: { size: 33, type: WidthType.PERCENTAGE },
                                            children: [new Paragraph('$700')],
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    ],
                },
            ],
        });

        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, 'invoice.docx');
        });
    }

    // Convert Image to ArrayBuffer
    getImageAsArrayBuffer(url: string): Promise<ArrayBuffer> {
        return fetch(url).then((response) => response.arrayBuffer());
    }
}
