"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { UploadButton } from "@uploadthing/react";

interface ImportDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const availableTags = [
  "contract",
  "template",
  "legal",
  "proposal",
  "project",
  "meeting",
  "notes",
  "agreement",
  "invoice",
  "report",
];

export function ImportDocumentModal({
  open,
  onOpenChange,
}: ImportDocumentModalProps) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [dragActive, setDragActive] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (
          file.type === "application/pdf" ||
          file.name.toLowerCase().endsWith(".pdf")
        ) {
          setSelectedFile(file);
          if (!title) {
            setTitle(file.name.replace(/\.[^/.]+$/, ""));
          }
        } else {
          alert("Please select a PDF file");
        }
      }
    },
    [title]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf")
      ) {
        setSelectedFile(file);
        if (!title) {
          setTitle(file.name.replace(/\.[^/.]+$/, ""));
        }
      } else {
        alert("Please select a PDF file");
      }
    }
  };

  const handleBrowseFiles = () => {
    fileInputRef.current?.click();
  };

  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setSelectedTags([]);
    setSelectedFile(null);
    setDragActive(false);
    onOpenChange(false);
  };

  const handleImport = () => {
    if (!selectedFile || !title.trim()) {
      alert("Please select a file and enter a title");
      return;
    }

    // Handle import logic here
    console.log("Importing document:", {
      title,
      description,
      tags: selectedTags,
      file: selectedFile,
    });

    handleCancel();
  };

  const handleGoogleDriveImport = () => {
    // Handle Google Drive import logic here
    console.log("Import from Google Drive");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Document</DialogTitle>
          <p className="text-sm text-gray-600">
            Import a new document to your collection.
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Import Options */}
          <div className="flex gap-3">
            <UploadButton
              endpoint="pdfUploader"
              onClientUploadComplete={(res) => {
                // Do something with the response
                console.log("Files: ", res);
                alert("Upload Completed");
              }}
              onUploadError={(error: Error) => {
                // Do something with the error.
                alert(`ERROR! ${error.message}`);
              }}
            >
              <Button
                variant="outline"
                className="flex-1 justify-start gap-2 bg-transparent"
                // onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" />
                Upload File
              </Button>
            </UploadButton>
            <Button
              variant="outline"
              className="flex-1 justify-start gap-2 bg-transparent"
              onClick={handleGoogleDriveImport}
            >
              <FileText className="h-4 w-4" />
              Import from Google Drive
              <Badge variant="secondary" className="ml-auto text-xs">
                PRO
              </Badge>
            </Button>
          </div>

          {/* Document Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Document Title
            </Label>
            <Input
              id="title"
              placeholder="Enter document title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter document description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* File Upload Area */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">File</Label>
            <div
              className={cn(
                "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : selectedFile
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-gray-400"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 text-gray-400">
                  <Upload className="w-full h-full" />
                </div>

                {selectedFile ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-green-700">
                      File selected:
                    </p>
                    <p className="text-sm text-gray-600">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Drag and drop your PDF file here, or
                    </p>
                    <Button variant="outline" onClick={handleBrowseFiles}>
                      Browse Files
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tags</Label>
            <Select onValueChange={handleTagSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select tags..." />
              </SelectTrigger>
              <SelectContent>
                {availableTags
                  .filter((tag) => !selectedTags.includes(tag))
                  .map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => handleTagRemove(tag)}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!selectedFile || !title.trim()}
          >
            Import
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
