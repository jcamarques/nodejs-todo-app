-- AlterTable
ALTER TABLE "items" ADD COLUMN     "checkedAt" TIMESTAMP(3),
ADD COLUMN     "position" SERIAL NOT NULL;
