-- AlterTable
ALTER TABLE "public"."Branch" ADD COLUMN     "address" TEXT,
ADD COLUMN     "contactNumber" TEXT,
ADD COLUMN     "facilities" JSONB,
ADD COLUMN     "schedule" JSONB;
