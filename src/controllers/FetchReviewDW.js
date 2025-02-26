import { PrismaClient } from '@prisma/client';

export class FetchReviewDW {
    constructor(prismaClient = new PrismaClient()) {
        this.prisma = prismaClient;
    }

    async getReviewByDwId(userId, dwId) {
        try {
            const reviews = await this.queryReview(dwId);
            const dogs = await this.findDogByUserId(userId);

            if (reviews.length === 0) {
                return {
                    success: false,
                    message: 'dog walker not found',
                };
            }

            return {
                success: true,
                dogWalkers: reviews[0], // Assuming there's only one dog walker with the given ID
                dogs: dogs
            };

        } catch (error) {
            console.error('Error fetching reviews:', error);
            return {
                success: false,
                message: 'Failed to fetch dog walker reviews'
            };
        }
    }

    async queryReview(dwId) {
        return this.prisma.$queryRaw`
            SELECT dw.dw_id   AS id,
                   dw.dw_name AS name,
                   dw.dw_pic  AS pic,
                   dw.dw_tel  AS tel,
                   dw.dw_zone AS zone,
                   COALESCE(AVG(r.rating)::NUMERIC(10,2), 0) AS "meanRating",
                   COUNT(r.rating)::INTEGER AS "ratingCount",
                   COALESCE(
                       JSON_AGG(
                           JSON_BUILD_OBJECT(
                               'user_id', u.u_id,
                               'username', u.u_username,
                               'text', r.r_text,
                               'rating', r.rating,
                               'time', r.r_time
                           )
                       ) FILTER (WHERE r.r_text IS NOT NULL), '[]'::JSON
                   ) AS reviews
            FROM
                dog_walker dw
                LEFT JOIN
                walking_service ws
            ON dw.dw_id = ws.dw_id
                LEFT JOIN
                review r ON ws.ws_id = r.ws_id
                LEFT JOIN
                "user" u ON r.u_id = u.u_id
            WHERE
                dw.dw_id = ${dwId}
            GROUP BY
                dw.dw_id, dw.dw_name, dw.dw_pic, dw.dw_tel, dw.dw_zone
            ORDER BY
                "meanRating" DESC;
        `;
    }

    async findDogByUserId(userId) {
        return this.prisma.dog.findMany({
            where: {
                ownerId: userId, // No need for `eq:`
            },
            select: {
              id: true,
              name: true
            }
        });
    }

}
