-- CreateTable
CREATE TABLE "Actualite" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileUrl" TEXT,

    CONSTRAINT "Actualite_pkey" PRIMARY KEY ("id")
);
