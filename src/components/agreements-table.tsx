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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { SendAgreementModal } from "./send-agreement-modal";

interface Agreement {
  id: string;
  name: string;
  status: "completed" | "pending" | "draft" | "cancelled";
  created: string;
  createdDate: Date;
}

const agreements: Agreement[] = [
  {
    id: "1",
    name: "sign this bro",
    status: "completed",
    created: "Jul 19, 2025",
    createdDate: new Date("2025-07-19"),
  },
  {
    id: "2",
    name: "new-agreement for test",
    status: "pending",
    created: "Jul 19, 2025",
    createdDate: new Date("2025-07-19"),
  },
  {
    id: "3",
    name: "axsxsxsxsx",
    status: "pending",
    created: "Jun 25, 2025",
    createdDate: new Date("2025-06-25"),
  },
  {
    id: "4",
    name: "psn",
    status: "pending",
    created: "Jun 25, 2025",
    createdDate: new Date("2025-06-25"),
  },
];

const getStatusBadge = (status: Agreement["status"]) => {
  switch (status) {
    case "completed":
      return (
        <Badge
          variant="secondary"
          className="bg-green-50 text-green-700 hover:bg-green-50"
        >
          ✓ Completed
        </Badge>
      );
    case "pending":
      return (
        <Badge
          variant="secondary"
          className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50"
        >
          ⏳ Pending
        </Badge>
      );
    case "draft":
      return (
        <Badge
          variant="secondary"
          className="bg-gray-50 text-gray-700 hover:bg-gray-50"
        >
          📝 Draft
        </Badge>
      );
    case "cancelled":
      return (
        <Badge
          variant="secondary"
          className="bg-red-50 text-red-700 hover:bg-red-50"
        >
          ✕ Cancelled
        </Badge>
      );
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

export function AgreementsTable() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [pageSize, setPageSize] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [modalOpen, setModalOpen] = React.useState(false);

  const [visibleColumns, setVisibleColumns] = React.useState({
    name: true,
    status: true,
    created: true,
    actions: true,
  });

  const filteredAgreements = agreements.filter((agreement) =>
    agreement.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAgreements.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentAgreements = filteredAgreements.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agreements</h1>
          <p className="text-gray-600 mt-1">
            Send and manage your agreements here.
          </p>
        </div>
        <Button
          className="bg-black hover:bg-gray-800 text-white"
          onClick={() => setModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Send Agreement
        </Button>
      </div>

      {/* Filters and Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Filter agreements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuCheckboxItem
              checked={visibleColumns.name}
              onCheckedChange={(checked) =>
                setVisibleColumns((prev) => ({ ...prev, name: checked }))
              }
            >
              Agreement Name
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.status}
              onCheckedChange={(checked) =>
                setVisibleColumns((prev) => ({ ...prev, status: checked }))
              }
            >
              Status
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.created}
              onCheckedChange={(checked) =>
                setVisibleColumns((prev) => ({ ...prev, created: checked }))
              }
            >
              Created
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.actions}
              onCheckedChange={(checked) =>
                setVisibleColumns((prev) => ({ ...prev, actions: checked }))
              }
            >
              Actions
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.name && (
                <TableHead className="font-medium">Agreement Name</TableHead>
              )}
              {visibleColumns.status && (
                <TableHead className="font-medium">Status</TableHead>
              )}
              {visibleColumns.created && (
                <TableHead className="font-medium">Created</TableHead>
              )}
              {visibleColumns.actions && (
                <TableHead className="font-medium w-20"></TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentAgreements.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={Object.values(visibleColumns).filter(Boolean).length}
                  className="text-center py-8 text-gray-500"
                >
                  No agreements found.
                </TableCell>
              </TableRow>
            ) : (
              currentAgreements.map((agreement) => (
                <TableRow key={agreement.id} className="hover:bg-gray-50">
                  {visibleColumns.name && (
                    <TableCell className="font-medium">
                      {agreement.name}
                    </TableCell>
                  )}
                  {visibleColumns.status && (
                    <TableCell>{getStatusBadge(agreement.status)}</TableCell>
                  )}
                  {visibleColumns.created && (
                    <TableCell className="text-gray-600">
                      {agreement.created}
                    </TableCell>
                  )}
                  {visibleColumns.actions && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        View
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Total {filteredAgreements.length} row(s)
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

      <SendAgreementModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
