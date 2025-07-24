File Upload flow

[1] User selects PDF file in Next.js client
      ↓
[2] Upload file directly to UploadThing via their SDK (client-side)
      ↓
[3] UploadThing returns a file URL (hosted on their storage, e.g., S3)
      ↓
[4] Send the file URL (and optional metadata) to your Node.js backend API
      ↓
[5] Backend validates (optional) and saves the URL to your database (e.g., PostgreSQL via Prisma)
      ↓
[6] Return success response to frontend and show file/link in UI
