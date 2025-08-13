-- CreateTable
CREATE TABLE "public"."Registration" (
    "id" SERIAL NOT NULL,
    "aadhaarNumber" TEXT NOT NULL,
    "entrepreneurName" TEXT NOT NULL,
    "orgType" TEXT NOT NULL,
    "panNumber" TEXT NOT NULL,
    "panHolderName" TEXT NOT NULL,
    "dobOrDoi" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);
