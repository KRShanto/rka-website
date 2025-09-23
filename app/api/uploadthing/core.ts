import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

/**
 * FileRouter for UploadThing. Add your app's upload endpoints here.
 * Each route can define auth and file restrictions.
 */
export const ourFileRouter = {
  /** Minimal public image uploader without middleware */
  imageUploader: f({
    image: { maxFileSize: "16MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    return { url: file.ufsUrl } as const;
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
