"use client";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "../app/globals.css";

// Configure the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@2.10.377/build/pdf.worker.min.js`;

const Resume: React.FC = () => {
	const [numPages, setNumPages] = useState<number | null>(null);
	const [pageNumber, setPageNumber] = useState<number>(1);

	function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
		setNumPages(numPages);
	}

	return (
		<div className="flex flex-col items-center mt-10">
			<Document
				file="/AustinSpragginsResume2024.pdf" // Ensure this serves from the public directory
				onLoadSuccess={onDocumentLoadSuccess}
				className="border border-gray-300 shadow-lg"
			>
				<Page pageNumber={pageNumber} />
			</Document>
			<div className="mt-4">
				<p>
					Page {pageNumber} of {numPages}
				</p>
				<button
					onClick={() => setPageNumber((page) => Math.max(page - 1, 1))}
					disabled={pageNumber <= 1}
					className="bg-primary text-background px-4 py-2 rounded mr-2"
				>
					Previous
				</button>
				<button
					onClick={() =>
						setPageNumber((page) => Math.min(page + 1, numPages || 1))
					}
					disabled={pageNumber >= (numPages || 1)}
					className="bg-primary text-background px-4 py-2 rounded"
				>
					Next
				</button>
			</div>
		</div>
	);
};

export default Resume;
