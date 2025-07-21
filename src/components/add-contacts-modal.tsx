"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Upload, User, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface AddContactsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type UploadMode = "single" | "bulk"

export function AddContactsModal({ open, onOpenChange }: AddContactsModalProps) {
  const [mode, setMode] = React.useState<UploadMode>("single")
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [company, setCompany] = React.useState("")
  const [dragActive, setDragActive] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleDrag = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv")) {
        setSelectedFile(file)
      } else {
        alert("Please select a CSV file")
      }
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv")) {
        setSelectedFile(file)
      } else {
        alert("Please select a CSV file")
      }
    }
  }

  const handleBrowseFiles = () => {
    fileInputRef.current?.click()
  }

  const handleCancel = () => {
    setMode("single")
    setName("")
    setEmail("")
    setCompany("")
    setSelectedFile(null)
    setDragActive(false)
    onOpenChange(false)
  }

  const handleAddContact = () => {
    if (mode === "single") {
      if (!name.trim() || !email.trim()) {
        alert("Please enter both name and email")
        return
      }

      console.log("Adding single contact:", {
        name: name.trim(),
        email: email.trim(),
        company: company.trim() || undefined,
      })
    } else {
      if (!selectedFile) {
        alert("Please select a CSV file")
        return
      }

      console.log("Uploading contacts from CSV:", selectedFile)
    }

    handleCancel()
  }

  const handleBulkUpload = () => {
    // For demo purposes, just switch to bulk mode
    // In a real app, this might require a PRO subscription check
    setMode("bulk")
  }

  const isFormValid = () => {
    if (mode === "single") {
      return name.trim() && email.trim()
    } else {
      return selectedFile !== null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Contacts</DialogTitle>
          <p className="text-sm text-gray-600">Add individual contacts or upload multiple contacts from a CSV file.</p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Mode Toggle */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            <Button
              variant={mode === "single" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMode("single")}
              className={cn(
                "flex-1 justify-start gap-2",
                mode === "single"
                  ? "bg-white shadow-sm hover:bg-white"
                  : "hover:bg-transparent text-gray-600 hover:text-gray-900",
              )}
            >
              <User className="h-4 w-4" />
              Single Contact
            </Button>
            <Button
              variant={mode === "bulk" ? "default" : "ghost"}
              size="sm"
              onClick={handleBulkUpload}
              className={cn(
                "flex-1 justify-start gap-2",
                mode === "bulk"
                  ? "bg-white shadow-sm hover:bg-white"
                  : "hover:bg-transparent text-gray-600 hover:text-gray-900",
              )}
            >
              <Users className="h-4 w-4" />
              Bulk Upload
              <Badge variant="secondary" className="ml-auto text-xs">
                PRO
              </Badge>
            </Button>
          </div>

          {/* Single Contact Form */}
          {mode === "single" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter contact name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter contact email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-medium">
                  Company
                </Label>
                <Input
                  id="company"
                  placeholder="Enter company name (optional)"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Bulk Upload Form */}
          {mode === "bulk" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">CSV File</Label>
                <div
                  className={cn(
                    "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                    dragActive
                      ? "border-blue-500 bg-blue-50"
                      : selectedFile
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:border-gray-400",
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <div className="space-y-4">
                    <div className="mx-auto w-12 h-12 text-gray-400">
                      <Upload className="w-full h-full" />
                    </div>

                    {selectedFile ? (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-green-700">File selected:</p>
                        <p className="text-sm text-gray-600">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Drag and drop your CSV file here, or</p>
                        <Button variant="outline" onClick={handleBrowseFiles}>
                          Browse Files
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* CSV Format Help */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800 font-medium mb-1">CSV Format Requirements:</p>
                <p className="text-xs text-blue-700">
                  Your CSV should have columns: <code>name</code>, <code>email</code>, <code>company</code> (optional)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleAddContact} disabled={!isFormValid()}>
            {mode === "single" ? "Add Contact" : "Upload Contacts"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
