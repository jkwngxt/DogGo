-- CreateTable
CREATE TABLE "user" (
    "u_id" SERIAL NOT NULL,
    "u_name" TEXT NOT NULL,
    "u_username" TEXT NOT NULL,
    "u_password" TEXT NOT NULL,
    "u_email" TEXT NOT NULL,
    "u_tel" VARCHAR(10) NOT NULL,
    "u_address" TEXT NOT NULL,
    "u_zone" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("u_id")
);

-- CreateTable
CREATE TABLE "dog" (
    "d_id" SERIAL NOT NULL,
    "d_name" TEXT NOT NULL,
    "d_breed" TEXT NOT NULL,
    "u_id" INTEGER NOT NULL,

    CONSTRAINT "dog_pkey" PRIMARY KEY ("d_id")
);

-- CreateTable
CREATE TABLE "dog_walker" (
    "dw_id" SERIAL NOT NULL,
    "dw_name" TEXT NOT NULL,
    "dw_username" TEXT NOT NULL,
    "dw_password" TEXT NOT NULL,
    "dw_email" TEXT NOT NULL,
    "dw_pic" TEXT NOT NULL,
    "dw_tel" VARCHAR(10) NOT NULL,
    "dw_address" TEXT NOT NULL,
    "dw_zone" TEXT[],

    CONSTRAINT "dog_walker_pkey" PRIMARY KEY ("dw_id")
);

-- CreateTable
CREATE TABLE "walking_service" (
    "ws_id" SERIAL NOT NULL,
    "ws_request" TIMESTAMP NOT NULL,
    "ws_accept" TIMESTAMP NOT NULL,
    "ws_date" DATE NOT NULL,
    "ws_time" SMALLINT[],
    "ws_price" DECIMAL(8,2) NOT NULL,
    "ws_status" SMALLINT NOT NULL,
    "dw_id" INTEGER NOT NULL,
    "d_id" INTEGER[],
    "u_id" INTEGER NOT NULL,

    CONSTRAINT "walking_service_pkey" PRIMARY KEY ("ws_id")
);

-- CreateTable
CREATE TABLE "service_provider" (
    "sp_id" SERIAL NOT NULL,
    "sp_name" TEXT NOT NULL,
    "sp_des" TEXT NOT NULL,
    "sp_username" TEXT NOT NULL,
    "sp_password" TEXT NOT NULL,
    "sp_email" TEXT NOT NULL,
    "sp_tel" VARCHAR(10) NOT NULL,
    "sp_address" TEXT NOT NULL,
    "sp_zone" TEXT NOT NULL,

    CONSTRAINT "service_provider_pkey" PRIMARY KEY ("sp_id")
);

-- CreateTable
CREATE TABLE "service" (
    "s_id" SERIAL NOT NULL,
    "s_vis" BOOLEAN NOT NULL,
    "s_name" TEXT NOT NULL,
    "s_type" TEXT NOT NULL,
    "s_des" TEXT NOT NULL,
    "s_price" DECIMAL(8,2) NOT NULL,
    "sp_id" INTEGER NOT NULL,

    CONSTRAINT "service_pkey" PRIMARY KEY ("s_id")
);

-- CreateTable
CREATE TABLE "coupon" (
    "c_id" CHAR(12) NOT NULL,
    "c_price" DECIMAL(8,2) NOT NULL,
    "c_purches" TIMESTAMP NOT NULL,
    "c_status" SMALLINT NOT NULL,
    "s_id" INTEGER NOT NULL,
    "u_id" INTEGER NOT NULL,

    CONSTRAINT "coupon_pkey" PRIMARY KEY ("c_id")
);

-- CreateTable
CREATE TABLE "billing" (
    "b_id" SERIAL NOT NULL,
    "b_time" TIMESTAMP,
    "b_status" SMALLINT NOT NULL,
    "total" DECIMAL(8,2) NOT NULL,
    "u_id" INTEGER NOT NULL,
    "c_id" TEXT NOT NULL,
    "ws_id" INTEGER NOT NULL,

    CONSTRAINT "billing_pkey" PRIMARY KEY ("b_id")
);

-- CreateTable
CREATE TABLE "review" (
    "r_id" SERIAL NOT NULL,
    "r_time" TIMESTAMP NOT NULL,
    "rating" SMALLINT NOT NULL,
    "r_text" TEXT,
    "u_id" INTEGER NOT NULL,
    "c_id" TEXT NOT NULL,
    "ws_id" INTEGER NOT NULL,
    "replyto" INTEGER,

    CONSTRAINT "review_pkey" PRIMARY KEY ("r_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "billing_c_id_key" ON "billing"("c_id");

-- CreateIndex
CREATE UNIQUE INDEX "billing_ws_id_key" ON "billing"("ws_id");

-- CreateIndex
CREATE UNIQUE INDEX "review_c_id_key" ON "review"("c_id");

-- CreateIndex
CREATE UNIQUE INDEX "review_ws_id_key" ON "review"("ws_id");

-- AddForeignKey
ALTER TABLE "dog" ADD CONSTRAINT "dog_u_id_fkey" FOREIGN KEY ("u_id") REFERENCES "user"("u_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "walking_service" ADD CONSTRAINT "walking_service_dw_id_fkey" FOREIGN KEY ("dw_id") REFERENCES "dog_walker"("dw_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "walking_service" ADD CONSTRAINT "walking_service_u_id_fkey" FOREIGN KEY ("u_id") REFERENCES "user"("u_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service" ADD CONSTRAINT "service_sp_id_fkey" FOREIGN KEY ("sp_id") REFERENCES "service_provider"("sp_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon" ADD CONSTRAINT "coupon_s_id_fkey" FOREIGN KEY ("s_id") REFERENCES "service"("s_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon" ADD CONSTRAINT "coupon_u_id_fkey" FOREIGN KEY ("u_id") REFERENCES "user"("u_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing" ADD CONSTRAINT "billing_u_id_fkey" FOREIGN KEY ("u_id") REFERENCES "user"("u_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing" ADD CONSTRAINT "billing_c_id_fkey" FOREIGN KEY ("c_id") REFERENCES "coupon"("c_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing" ADD CONSTRAINT "billing_ws_id_fkey" FOREIGN KEY ("ws_id") REFERENCES "walking_service"("ws_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_u_id_fkey" FOREIGN KEY ("u_id") REFERENCES "user"("u_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_c_id_fkey" FOREIGN KEY ("c_id") REFERENCES "coupon"("c_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_ws_id_fkey" FOREIGN KEY ("ws_id") REFERENCES "walking_service"("ws_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_replyto_fkey" FOREIGN KEY ("replyto") REFERENCES "review"("r_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- constrain billing
ALTER TABLE billing
    ADD CONSTRAINT billing_exclusive_check
        CHECK ((ws_id IS NOT NULL AND c_id IS NULL) OR (ws_id IS NULL AND c_id IS NOT NULL));

-- constrain review
ALTER TABLE review
    ADD CONSTRAINT review_exclusive_check
        CHECK ((ws_id IS NOT NULL AND c_id IS NULL) OR (ws_id IS NULL AND c_id IS NOT NULL));
