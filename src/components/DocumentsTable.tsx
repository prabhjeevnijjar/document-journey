"use client";

import * as React from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Upload,
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Edit,
  Trash2,
} from "lucide-react";
import { ImportDocumentModal } from "./UploadDocumentModal";
import { useDocumentStore } from "@/app/store/documentStore";
import axios from "axios";
import { useAuthStore } from "@/app/store/authStore";
import { toast } from "sonner";

interface Document {
  id: string;
  title: string;
  description: string;
  tags: string[];
  uploaded: string;
  uploadedDate: Date;
  fileSize?: string;
  fileType?: string;
}

const documents: Document[] = [
  {
    id: "1",
    title: "test",
    description: "test doc",
    tags: [],
    uploaded: "June 25, 2025",
    uploadedDate: new Date("2025-06-25"),
    fileSize: "2.4 MB",
    fileType: "PDF",
  },
  // Add more sample documents if needed
  {
    id: "2",
    title: "Contract Template",
    description: "Standard contract template for new clients",
    tags: ["contract", "template", "legal"],
    uploaded: "June 20, 2025",
    uploadedDate: new Date("2025-06-20"),
    fileSize: "1.8 MB",
    fileType: "DOCX",
  },
  {
    id: "3",
    title: "Project Proposal",
    description: "Q3 project proposal document",
    tags: ["proposal", "project"],
    uploaded: "June 15, 2025",
    uploadedDate: new Date("2025-06-15"),
    fileSize: "3.2 MB",
    fileType: "PDF",
  },
];

export function DocumentsTable() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [pageSize, setPageSize] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [modalOpen, setModalOpen] = React.useState(false);

  const { token } = useAuthStore();
  const {
    documents,
    totalDocuments,
    isLoading,
    setDocuments,
    setTotalDocuments,
    setLoading,
    setError,
  } = useDocumentStore();

  const fetchDocuments = React.useCallback(() => {
    setLoading(true);

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/documents`, {
        params: {
          page: currentPage,
          limit: pageSize,
          search: searchTerm,
          tags: selectedTags.join(","),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status === "success") {
          setDocuments(response.data.data.documents);
          setTotalDocuments(response.data.data.total);
          setError(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
        setError(error.response?.data?.message || "Failed to fetch documents");
        toast.error("Failed to fetch documents");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, pageSize, searchTerm, selectedTags, token]);

  // Fetch documents when component mounts or dependencies change
  React.useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Update pagination calculations
  // const totalPages = Math.ceil(totalDocuments / pageSize);
  // const startIndex = (currentPage - 1) * pageSize;
  // const endIndex = startIndex + pageSize;

  const filteredDocuments = documents.filter((document) => {
    const matchesSearch = document?.originalFilename
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredDocuments.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentDocuments = filteredDocuments.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

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
          Import
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Tags
              {selectedTags.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {selectedTags.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="p-2">
              {selectedTags.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTags([])}
                  className="w-full mt-2 text-xs"
                >
                  Clear filters
                </Button>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Document Title</TableHead>
              <TableHead className="font-medium">Description</TableHead>
              <TableHead className="font-medium">Tags</TableHead>
              <TableHead className="font-medium">Uploaded</TableHead>
              <TableHead className="font-medium w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentDocuments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-gray-500"
                >
                  {searchTerm || selectedTags.length > 0
                    ? "No documents found matching your filters."
                    : "No documents found."}
                </TableCell>
              </TableRow>
            ) : (
              currentDocuments.map((document) => (
                <TableRow key={document.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {document.originalFilename}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {document.fileSize}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-gray-600">
                    {document.createdAt}
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
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
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
            <span className="text-sm text-gray-600">Rows per page</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages || 1}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="w-8 h-8 p-0"
              >
                <ChevronsLeft className="w-4 h-4" />
              </Button>
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 p-0"
              >
                <ChevronsRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ImportDocumentModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
