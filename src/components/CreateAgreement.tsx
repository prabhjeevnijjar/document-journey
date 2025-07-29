'use client'
import PdfSignatureInput from "./PdfSignatureInput";

export default function CreateAgreement() {
    return (
        <div className="container mx-auto p-6">
            <PdfSignatureInput url="https://drql8xhh5b.ufs.sh/f/dfyh5P9m5uENm9C0SIBpH7ywSzGArn6WFcIahb95kv3OM1fQ"
                onFieldsChange={(fields) => {
                    // Save or process fields as needed
                    console.log(fields);
                }} />
        </div>
    )
}
