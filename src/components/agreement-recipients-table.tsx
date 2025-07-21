"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ChevronDown,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Mail,
  MessageSquare,
  RefreshCw,
  Trash2,
  ArrowUpDown,
} from "lucide-react"

interface Recipient {
  id: string
  name: string
  email: string
  status: "completed" | "pending" | "viewed" | "sent"
  lastUpdated: string
  lastUpdatedDate: Date
}

interface AgreementRecipientsTableProps {
  recipients: Recipient[]
  title?: string
}

type SortField = "name" | "email" | "status" | "lastUpdated"
type SortDirection = "asc" | "desc" | null

const getStatusBadge = (status: Recipient["status"]) => {
  switch (status) {
    case "completed":
      return (
        <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-50">
          ✓ Completed
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
          ⏳ Pending
        </Badge>
      )
    case "viewed":
      return (
        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
          👁 Viewed
        </Badge>
      )
    case "sent":
      return (
        <Badge variant="secondary" className="bg-gray-50 text-gray-700 hover:bg-gray-50">
          📤 Sent
        </Badge>
      )
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}

export function AgreementRecipientsTable({ recipients, title = "Recipients" }: AgreementRecipientsTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [pageSize, setPageSize] = React.useState(10)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [sortField, setSortField] = React.useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null)
  const [visibleColumns, setVisibleColumns] = React.useState({
    name: true,
    email: true,
    status: true,
    lastUpdated: true,
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

  const sortedRecipients = React.useMemo(() => {
    if (!sortField || !sortDirection) return recipients

    return [...recipients].sort((a, b) => {
      let aValue: string | Date
      let bValue: string | Date

      if (sortField === "lastUpdated") {
        aValue = a.lastUpdatedDate
        bValue = b.lastUpdatedDate
      } else {
        aValue = a[sortField].toLowerCase()
        bValue = b[sortField].toLowerCase()
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [recipients, sortField, sortDirection])

  const filteredRecipients = sortedRecipients.filter(
    (recipient) =>
      recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipient.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredRecipients.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentRecipients = filteredRecipients.slice(startIndex, endIndex)

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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>

      {/* Filters and Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Filter recipients..."
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
              checked={visibleColumns.status}
              onCheckedChange={(checked) => setVisibleColumns((prev) => ({ ...prev, status: checked }))}
            >
              Status
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.lastUpdated}
              onCheckedChange={(checked) => setVisibleColumns((prev) => ({ ...prev, lastUpdated: checked }))}
            >
              Last Updated
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
              {visibleColumns.status && (
                <TableHead className="font-medium">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("status")}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Status
                    {getSortIcon("status")}
                  </Button>
                </TableHead>
              )}
              {visibleColumns.lastUpdated && (
                <TableHead className="font-medium">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("lastUpdated")}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Last Updated
                    {getSortIcon("lastUpdated")}
                  </Button>
                </TableHead>
              )}
              {visibleColumns.actions && <TableHead className="font-medium w-12"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRecipients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={Object.values(visibleColumns).filter(Boolean).length}
                  className="text-center py-8 text-gray-500"
                >
                  {searchTerm ? "No recipients found matching your search." : "No recipients found."}
                </TableCell>
              </TableRow>
            ) : (
              currentRecipients.map((recipient) => (
                <TableRow key={recipient.id} className="hover:bg-gray-50">
                  {visibleColumns.name && <TableCell className="font-medium">{recipient.name}</TableCell>}
                  {visibleColumns.email && <TableCell className="text-gray-600">{recipient.email}</TableCell>}
                  {visibleColumns.status && <TableCell>{getStatusBadge(recipient.status)}</TableCell>}
                  {visibleColumns.lastUpdated && (
                    <TableCell className="text-gray-600">{recipient.lastUpdated}</TableCell>
                  )}
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
                            Send Reminder
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Resend Agreement
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove Recipient
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
        <div className="text-sm text-gray-600">Total {filteredRecipients.length} row(s)</div>
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
