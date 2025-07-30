'use client';
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";
import { SignatureCoords, useAgreementStore } from "@/app/store/agreementsStore";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

const PdfSignatureInput = dynamic(() => import("./PdfSignatureInput"), { ssr: false });


export default function CreateAgreement() {
  const router = useRouter();

  const [agreementName, setAgreementName] = useState<string>("");
  const [signatureCoords, setSignatureCoords] = useState<SignatureCoords[]>([]);
  const { agreementData, setAgreementData, createAgreement } = useAgreementStore();
  console.log("=--=-=--", signatureCoords.length)

  const handleSendAgreement = () => {
    if (!agreementName) {
      toast.error("Agreement name is required");
      return;
    }
    if (!agreementData) {
      toast.error("Agreement data is required");
      return;
    }
    if (signatureCoords.length < 1) {
      toast.error("Please select at least 1 signature fields");
      return;
    }
    setAgreementData({
      ...agreementData,
      name: agreementName,
      signatureCoords: signatureCoords
    })
    const payload = {
      name: agreementName,
      receiverEmail: agreementData.receiverEmail,
      fileUrl: agreementData.fileUrl,
      mimeType: agreementData.mimeType,
      signatureCoords: signatureCoords,
      originalFilename: agreementData.originalFilename,
    }
    createAgreement(payload)

  }

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      // Set flag to sessionStorage to indicate a reload attempt
      sessionStorage.setItem('reloaded', 'yes');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // On mount, check for flag
    if (sessionStorage.getItem('reloaded') === 'yes') {
      sessionStorage.removeItem('reloaded'); // Clean up
      router.replace('/agreements');
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [router]);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Left: Form */}
      <Card className="w-full md:max-w-xs flex-shrink-0">
        <CardHeader>
          <CardTitle>Create Agreement</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Agreement Name</label>
            <Input
              placeholder="Enter agreement name"
              value={agreementName}
              onChange={e => setAgreementName(e.target.value)}
            />
          </div>
          <div>
            <div className="flex flex-col gap-2">
              <p className="w-full">Select the fields you want to sign</p>

            </div>
          </div>
          <Button className="w-full mt-2" disabled={!agreementName} onClick={handleSendAgreement}>
            Send Agreement
          </Button>
        </CardContent>
      </Card>

      <div className="flex-1 min-w-0">
        <Card className="h-full">
          <CardContent className="p-2 md:p-4 h-full flex flex-col">
            <PdfSignatureInput
              url={agreementData?.fileUrl || ""}
              onFieldsChange={(fields: SignatureCoords[]) => {
                console.log(fields);
                setSignatureCoords(fields);
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
