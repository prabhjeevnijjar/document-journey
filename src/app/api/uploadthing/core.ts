// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  // Customize this route name
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete:", file.url);

      // Optional: Save to DB here or send event to backend
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
