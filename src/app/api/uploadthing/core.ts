import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } }).onUploadComplete(
    async ({ metadata, file }) => {
      console.log("File:", file, metadata);
    }
  ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
