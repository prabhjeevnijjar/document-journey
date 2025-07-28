'use client'
import React, { useState, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

interface PdfViewerModalProps {
    url: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ViewPdf({ url, open, onOpenChange }: PdfViewerModalProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);

    // When loading success handler
    const onDocumentLoadSuccess = useCallback((pdf: { numPages: number }) => {
        setNumPages(pdf.numPages);
        setPageNumber(1);
        setLoading(false);
    }, []);

    // When loading error handler
    const onDocumentLoadError = useCallback((error: any) => {
        console.error("Error while loading PDF document:", error);
        setLoading(false);
    }, []);

    // Handler to download the PDF
    const handleDownload = () => {
        // Create a hidden link and trigger download
        const link = document.createElement("a");
        link.href = url;
        // Try to get filename from URL or fallback
        const fileName = url.split("/").pop() || "download.pdf";
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Reset loading state if the URL or open changes
    useEffect(() => {
        if (open) {
            setLoading(true);
        }
    }, [url, open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[90vw] max-h-[80vh] p-0">
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle></DialogTitle>
                    {/* Download button */}

                </DialogHeader>

                <div className="relative bg-gray-50 dark:bg-gray-900 overflow-auto flex justify-center" style={{ maxHeight: '80vh', maxWidth: '90vw' }}>
                    {loading && (
                        <div
                            role="status"
                            aria-live="polite"
                            aria-busy="true"
                            className="absolute inset-0 flex justify-center items-center bg-gray-100 dark:bg-gray-800"
                        >
                            {/* Simple spinner */}
                            <svg
                                className="animate-spin h-10 w-10 text-blue-600"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8H4z"
                                ></path>
                            </svg>
                            <span className="sr-only">Loading PDF...</span>
                        </div>
                    )}

                    {/* React PDF Viewer */}
                    <Document
                        file={url}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={null} // disables internal loader, we use custom one
                        className="overflow-auto"
                    >
                        {/* Display one page at a time */}
                        <Page pageNumber={pageNumber} scale={1.3} renderTextLayer={false} />
                    </Document>

                </div>
            </DialogContent>
        </Dialog>
    );
}
export type ViewPdfProps = {
    url: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};