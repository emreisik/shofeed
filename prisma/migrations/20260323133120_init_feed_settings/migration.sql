-- CreateTable
CREATE TABLE "FeedSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "feedToken" TEXT NOT NULL,
    "googleEnabled" BOOLEAN NOT NULL DEFAULT true,
    "facebookEnabled" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT NOT NULL DEFAULT 'My Store Feed',
    "description" TEXT NOT NULL DEFAULT '',
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "productType" TEXT NOT NULL DEFAULT 'new',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "FeedSettings_shop_key" ON "FeedSettings"("shop");

-- CreateIndex
CREATE UNIQUE INDEX "FeedSettings_feedToken_key" ON "FeedSettings"("feedToken");
