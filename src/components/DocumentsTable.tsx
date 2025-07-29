"use client";
import * as React from "react";
import dynamic from 'next/dynamic';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Upload,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  Trash2,
} from "lucide-react";
import { ImportDocumentModal } from "./UploadDocumentModal";
import { useDocumentStore } from "@/app/store/documentStore";
import { formatBytes, formatReadableDate } from "@/lib/utils";
import { ViewPdfProps } from "./ViewPdf";

const PdfViewerModal = dynamic<ViewPdfProps>(
  () => import('./ViewPdf').then(mod => mod.ViewPdf),
  { ssr: false }
);
export function DocumentsTable() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [pageSize, setPageSize] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [pdfUrl, setPdfUrl] = React.useState("");

  const {
    documents,
    totalDocuments,
    isLoading,
    fetchDocuments
  } = useDocumentStore();

  React.useEffect(() => {
    const fetchData = async () => {
      const result = await fetchDocuments(currentPage, pageSize);
      setTotalPages(result.totalPages);
    };
    fetchData();
  }, [currentPage, pageSize, fetchDocuments]);

  const filteredDocuments = documents.filter((document) => {
    const matchesSearch = document?.originalFilename
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesSearch;
  });
  console.log({ filteredDocuments })

  const handlePageChange = (page: number) =>
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600 mt-1">Manage your documents here.</p>
        </div>
        <Button
          className="bg-black hover:bg-gray-800 text-white"
          onClick={() => setModalOpen(true)}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
      </div>

      {/* Filters and Controls */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Filter documents by title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Document Title</TableHead>
              <TableHead className="font-medium">Description</TableHead>
              <TableHead className="font-medium w-12"></TableHead>

              <TableHead className="font-medium">Uploaded</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-gray-500"
                >
                  {searchTerm
                    ? "No documents found matching your filters."
                    : isLoading
                      ? "Loading documents..."
                      : "No documents found."}
                </TableCell>
              </TableRow>
            ) : (
              filteredDocuments.map((document) => (
                <TableRow key={document.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {document.originalFilename}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatBytes(document.fileSize)}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-gray-600">
                    {formatReadableDate(document.createdAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem >
                          <Button onClick={() => { setPdfUrl(document.fileUrl); setOpen(true); }}>
                            <Download className="w-4 h-4 mr-2" />

                          </Button>
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Total {filteredDocuments.length} row(s)
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages || 1}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ImportDocumentModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        fetchDocuments={() => fetchDocuments(currentPage, pageSize)}
      />
      <PdfViewerModal url={pdfUrl} open={open} onOpenChange={setOpen} />
    </div>
  );
}
