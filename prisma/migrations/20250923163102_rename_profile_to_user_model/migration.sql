/*
  Warnings:

  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Profile" DROP CONSTRAINT "Profile_branchId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "branchId" TEXT,
ADD COLUMN     "currentBelt" TEXT,
ADD COLUMN     "currentDan" INTEGER,
ADD COLUMN     "danExamDates" JSONB,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "fatherName" TEXT,
ADD COLUMN     "gender" "public"."Gender",
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "joinDate" TIMESTAMP(3),
ADD COLUMN     "motherName" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'USER',
ADD COLUMN     "weight" DOUBLE PRECISION;

-- DropTable
DROP TABLE "public"."Profile";

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
