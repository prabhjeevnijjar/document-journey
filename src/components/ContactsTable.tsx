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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Upload,
  ChevronDown,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Mail,
  Phone,
  ArrowUpDown,
} from "lucide-react";
import { AddContactsModal } from "./add-contacts-modal";
import { useContactStore } from "@/app/store/contactStore";
import axios from "axios";
import { toast } from "sonner";

interface Contact {
  id: string;
  name?: string;
  email: string;
  company: string;
  addedOn: string;
  addedDate: Date;
  phone?: string;
}


export function ContactsTable() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [pageSize, setPageSize] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);
  const [modalOpen, setModalOpen] = React.useState(false);
 const {
    contacts,
    totalContacts,
    isLoading,
    setContacts,
    setTotalContacts,
    setLoading,
    setError
  } = useContactStore();

  const fetchContacts = React.useCallback(() => {
    setLoading(true);

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/contacts`, {
        params: {
          page: currentPage,
          limit: pageSize,
        },
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status === "success") {
          console.log("Fetched documents:", response.data);
          setContacts([]);
          setContacts(response.data.data.documents);
          setTotalContacts(response.data.data.total);
          setTotalPages(response.data.data.totalPages);
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
  }, [currentPage]);

  // Fetch documents when component mounts or dependencies change
  React.useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const filteredContacts = contacts?.filter((contact) => {
    const matchesSearch = contact?.email
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesSearch;
  });
  console.log("Filtered Documents:", filteredContacts);

  const handlePageChange = (page: number) =>
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-1">
            Upload and manage your contacts here
          </p>
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
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Filter emails..."
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
              {
                <TableHead className="font-medium">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Name
                  </Button>
                </TableHead>
              }
              {
                <TableHead className="font-medium">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Email
                  </Button>
                </TableHead>
              }
             
             
                <TableHead className="font-medium">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Added On
                  </Button>
                </TableHead>
           
             
                <TableHead className="font-medium w-12"></TableHead>
              
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts?.length === 0 ? (
              <TableRow>
                <TableCell
                  className="text-center py-8 text-gray-500"
                >
                  {searchTerm
                    ? "No contacts found matching your search."
                    : "No contacts found."}
                </TableCell>
              </TableRow>
            ) : (
              filteredContacts?.map((contact) => (
                <TableRow key={contact.id} className="hover:bg-gray-50">
                 
             
                    <TableCell className="text-gray-600">
                      {contact.email}
                    </TableCell>
                  
                 
                    <TableCell className="text-gray-600">
                      {contact.createdAt}
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
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="w-4 h-4 mr-2" />
                            Call
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
          Total {filteredContacts?.length} row(s)
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
      <AddContactsModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
