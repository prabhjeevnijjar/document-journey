"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Upload,
  ChevronDown,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Trash2,
  Mail,
  Phone,
  ArrowUpDown,
} from "lucide-react"

interface Contact {
  id: string
  name: string
  email: string
  company: string
  addedOn: string
  addedDate: Date
  phone?: string
}

const contacts: Contact[] = [
  {
    id: "1",
    name: "psn",
    email: "prabhjeevnijjar@hotmail.com",
    company: "-",
    addedOn: "July 19, 2025",
    addedDate: new Date("2025-07-19"),
    phone: "+1 (555) 123-4567",
  },
  {
    id: "2",
    name: "pari",
    email: "parinijjar@gmail.com",
    company: "-",
    addedOn: "June 25, 2025",
    addedDate: new Date("2025-06-25"),
    phone: "+1 (555) 987-6543",
  },
  {
    id: "3",
    name: "Prabhjeev Nijjar",
    email: "prabhjeevnijjar@gmail.com",
    company: "-",
    addedOn: "June 25, 2025",
    addedDate: new Date("2025-06-25"),
    phone: "+1 (555) 456-7890",
  },
  {
    id: "4",
    name: "John Smith",
    email: "john.smith@company.com",
    company: "Tech Corp",
    addedOn: "June 20, 2025",
    addedDate: new Date("2025-06-20"),
    phone: "+1 (555) 111-2222",
  },
  {
    id: "5",
    name: "Sarah Johnson",
    email: "sarah.j@startup.io",
    company: "StartupXYZ",
    addedOn: "June 15, 2025",
    addedDate: new Date("2025-06-15"),
    phone: "+1 (555) 333-4444",
  },
]

type SortField = "name" | "email" | "company" | "addedOn"
type SortDirection = "asc" | "desc" | null

export function ContactsTable() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [pageSize, setPageSize] = React.useState(10)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [sortField, setSortField] = React.useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null)
  const [visibleColumns, setVisibleColumns] = React.useState({
    name: true,
    email: true,
    company: true,
    addedOn: true,
    actions: true,
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortField(null)
        setSortDirection(null)
      } else {
        setSortDirection("asc")
      }
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedContacts = React.useMemo(() => {
    if (!sortField || !sortDirection) return contacts

    return [...contacts].sort((a, b) => {
      let aValue: string | Date
      let bValue: string | Date

      if (sortField === "addedOn") {
        aValue = a.addedDate
        bValue = b.addedDate
      } else {
        aValue = a[sortField].toLowerCase()
        bValue = b[sortField].toLowerCase()
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [sortField, sortDirection])

  const filteredContacts = sortedContacts.filter(
    (contact) =>
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredContacts.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentContacts = filteredContacts.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />
    if (sortDirection === "asc") return <ArrowUpDown className="ml-2 h-4 w-4 rotate-180" />
    if (sortDirection === "desc") return <ArrowUpDown className="ml-2 h-4 w-4" />
    return <ArrowUpDown className="ml-2 h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-1">Upload and manage your contacts here</p>
        </div>
        <Button className="bg-black hover:bg-gray-800 text-white">
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
              onCheckedChange={(checked) => setVisibleColumns((prev) => ({ ...prev, name: checked }))}
            >
              Name
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.email}
              onCheckedChange={(checked) => setVisibleColumns((prev) => ({ ...prev, email: checked }))}
            >
              Email
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.company}
              onCheckedChange={(checked) => setVisibleColumns((prev) => ({ ...prev, company: checked }))}
            >
              Company
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.addedOn}
              onCheckedChange={(checked) => setVisibleColumns((prev) => ({ ...prev, addedOn: checked }))}
            >
              Added On
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.actions}
              onCheckedChange={(checked) => setVisibleColumns((prev) => ({ ...prev, actions: checked }))}
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
                <TableHead className="font-medium">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("name")}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Name
                    {getSortIcon("name")}
                  </Button>
                </TableHead>
              )}
              {visibleColumns.email && (
                <TableHead className="font-medium">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("email")}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Email
                    {getSortIcon("email")}
                  </Button>
                </TableHead>
              )}
              {visibleColumns.company && (
                <TableHead className="font-medium">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("company")}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Company
                    {getSortIcon("company")}
                  </Button>
                </TableHead>
              )}
              {visibleColumns.addedOn && (
                <TableHead className="font-medium">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("addedOn")}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Added On
                    {getSortIcon("addedOn")}
                  </Button>
                </TableHead>
              )}
              {visibleColumns.actions && <TableHead className="font-medium w-12"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentContacts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={Object.values(visibleColumns).filter(Boolean).length}
                  className="text-center py-8 text-gray-500"
                >
                  {searchTerm ? "No contacts found matching your search." : "No contacts found."}
                </TableCell>
              </TableRow>
            ) : (
              currentContacts.map((contact) => (
                <TableRow key={contact.id} className="hover:bg-gray-50">
                  {visibleColumns.name && <TableCell className="font-medium">{contact.name}</TableCell>}
                  {visibleColumns.email && <TableCell className="text-gray-600">{contact.email}</TableCell>}
                  {visibleColumns.company && (
                    <TableCell className="text-gray-600">
                      {contact.company === "-" ? <span className="text-gray-400">-</span> : contact.company}
                    </TableCell>
                  )}
                  {visibleColumns.addedOn && <TableCell className="text-gray-600">{contact.addedOn}</TableCell>}
                  {visibleColumns.actions && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
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
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Total {filteredContacts.length} row(s)</div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value))
                setCurrentPage(1)
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
    </div>
  )
}
