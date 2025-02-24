/*
  Warnings:

  - A unique constraint covering the columns `[dw_username]` on the table `dog_walker` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[dw_email]` on the table `dog_walker` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sp_username]` on the table `service_provider` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sp_email]` on the table `service_provider` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[u_username]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[u_email]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "dog_walker_dw_username_key" ON "dog_walker"("dw_username");

-- CreateIndex
CREATE UNIQUE INDEX "dog_walker_dw_email_key" ON "dog_walker"("dw_email");

-- CreateIndex
CREATE UNIQUE INDEX "service_provider_sp_username_key" ON "service_provider"("sp_username");

-- CreateIndex
CREATE UNIQUE INDEX "service_provider_sp_email_key" ON "service_provider"("sp_email");

-- CreateIndex
CREATE UNIQUE INDEX "user_u_username_key" ON "user"("u_username");

-- CreateIndex
CREATE UNIQUE INDEX "user_u_email_key" ON "user"("u_email");
