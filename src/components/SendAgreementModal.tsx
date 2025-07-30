"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { X, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Contact, useContactStore } from "@/app/store/contactStore";
import { Document, useDocumentStore } from "@/app/store/documentStore";
import { useRouter } from "next/navigation";
import { useAgreementStore } from "@/app/store/agreementsStore";
import { toast } from "sonner";

interface SendAgreementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}


export function SendAgreementModal({
  open,
  onOpenChange,
}: SendAgreementModalProps) {
  const {
    contacts,
    
    fetchContacts
  } = useContactStore();
  const { documents, fetchDocuments } = useDocumentStore();
  const { setAgreementData } = useAgreementStore();
  console.log({ contacts })
  console.log({ documents })
  // fetchContacts(1, 10)
  const router = useRouter()
  const [selectedDocument, setSelectedDocument] =
    React.useState<Document | null>(null);
  const [selectedContacts, setSelectedContacts] = React.useState<Contact[]>([]);
  const [documentSearchOpen, setDocumentSearchOpen] = React.useState(false);
  const [contactSearchOpen, setContactSearchOpen] = React.useState(false);
  const [documentSearch, setDocumentSearch] = React.useState("");
  const [contactSearch, setContactSearch] = React.useState("");
  const [pageSize, setPageSize] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);

  // Fetch contacts when modal opens
  React.useEffect(() => {
    if (open) {
      fetchContacts(1, 10);
    }
  }, [open, fetchContacts]);

  React.useEffect(() => {
    if (open) {
      fetchDocuments(1, 10);
    }
  }, [open, fetchDocuments]);

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(documentSearch.toLowerCase()));

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
      contact.email.toLowerCase().includes(contactSearch.toLowerCase())
  );

  const handleDocumentSelect = (document: Document) => {
    setSelectedDocument(document);
    setDocumentSearchOpen(false);
  };

  const handleContactSelect = (contact: Contact) => {
    if (!selectedContacts.find((c) => c.id === contact.id)) {
      setSelectedContacts([...selectedContacts, contact]);
    }
    setContactSearchOpen(false);
    setContactSearch("");
  };

  const handleContactRemove = (contactId: string) => {
    setSelectedContacts(selectedContacts.filter((c) => c.id !== contactId));
  };

  const handleCancel = () => {
    setSelectedDocument(null);
    setSelectedContacts([]);
    setDocumentSearch("");
    setContactSearch("");
    onOpenChange(false);
  };

  const handleNext = () => {
// add validations for receiverEmail, originalFilename, fileUrl
    if (!selectedDocument) {
      toast.error("Please select a document");
      return;
    }
    if (selectedContacts.length === 0) {
      toast.error("Please select at least one recipient");
      return;
    }
    setAgreementData({
      name: "",
      receiverEmail: selectedContacts.map((contact) => ({
        name: contact.name,
        email: contact.email
      })),
      fileUrl: selectedDocument?.fileUrl || "",
      originalFilename: selectedDocument?.originalFilename || "",
      signatureCoords: []
    })
    router.push("/agreements/create")
    onOpenChange(false);
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Agreement</DialogTitle>
          <p className="text-sm text-gray-600">
            Select a document and recipients to send your agreement.
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Select Document */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select Document</Label>
            <div className="flex gap-2">
              <Popover
                open={documentSearchOpen}
                onOpenChange={setDocumentSearchOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={documentSearchOpen}
                    className="flex-1 justify-between bg-transparent"
                  >
                    {selectedDocument
                      ? selectedDocument.name
                      : "Select a document..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search documents..."
                      value={documentSearch}
                      onValueChange={setDocumentSearch}
                    />
                    <CommandList>
                      <CommandEmpty>No documents found.</CommandEmpty>
                      <CommandGroup>
                        {filteredDocuments.map((document) => (
                          <CommandItem
                            key={document.id}
                            value={document.name}
                            onSelect={() => handleDocumentSelect(document)}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {document.name}
                              </span>
                            </div>
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedDocument?.id === document.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

            </div>
          </div>

          {/* Select Recipients */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select Recipients</Label>
            <div className="flex gap-2">
              <Popover
                open={contactSearchOpen}
                onOpenChange={setContactSearchOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={contactSearchOpen}
                    className="flex-1 justify-between bg-transparent"
                  >
                    Select contacts...
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search contacts..."
                      value={contactSearch}
                      onValueChange={setContactSearch}
                    />
                    <CommandList>
                      <CommandEmpty>No contacts found.</CommandEmpty>
                      <CommandGroup>
                        {filteredContacts.map((contact) => (
                          <CommandItem
                            key={contact.id}
                            value={contact.email}
                            onSelect={() => handleContactSelect(contact)}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {contact.name}
                              </span>
                              <span className="text-sm text-gray-500">
                                {contact.email}
                              </span>

                            </div>
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedContacts.find(
                                  (c) => c.id === contact.id
                                )
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

            </div>

            {/* Selected Contacts */}
            {selectedContacts.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">
                  Selected Recipients:
                </Label>
                <div className="flex flex-wrap gap-2">
                  {selectedContacts.map((contact) => (
                    <Badge
                      key={contact.id}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <span>{contact.name}</span>
                      <button
                        onClick={() => handleContactRemove(contact.id)}
                        className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
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
            onClick={handleNext}
            disabled={!selectedDocument || selectedContacts.length === 0}
          >
            Next
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
