import { PrismaClient } from '@prisma/client';

export class FetchReviewDWController {
    constructor(prismaClient = new PrismaClient()) {
        this.prisma = prismaClient;
    }

    async getReviewByDwId(userId, dwId) {
        try {
            const result = await this.prisma.$queryRaw`
                WITH dog_walker_data AS (
                    SELECT 
                        dw_id as id, 
                        dw_name as name,
                        dw_pic as pic,
                        dw_tel as tel,
                        dw_zone as zone
                    FROM dog_walker
                    WHERE dw_id = ${dwId}
                ),
                user_zone AS (
                    SELECT u_zone as zone
                    FROM "user"
                    WHERE u_id = ${userId}
                ),
                user_dogs AS (
                    SELECT 
                        d_id as id, 
                        d_name as name
                    FROM dog
                    WHERE u_id = ${userId}
                ),
                relevant_services AS (
                    SELECT ws_id as id
                    FROM walking_service
                    WHERE dw_id = ${dwId}
                ),
                review_data AS (
                    SELECT 
                        r.r_id,
                        r.u_id as user_id,
                        u.u_username as username,
                        r.r_text as text,
                        r.rating,
                        r.r_time as time
                    FROM review r
                    JOIN "user" u ON r.u_id = u.u_id
                    WHERE r.ws_id IN (SELECT id FROM relevant_services)
                ),
                rating_summary AS (
                    SELECT 
                        COALESCE(AVG(rating), 0) as mean_rating,
                        COUNT(r_id) as rating_count
                    FROM review
                    WHERE ws_id IN (SELECT id FROM relevant_services)
                )
                SELECT 
                    json_build_object(
                        'dogWalker', (SELECT row_to_json(dog_walker_data) FROM dog_walker_data),
                        'userZone', (SELECT zone FROM user_zone),
                        'dogs', (SELECT json_agg(row_to_json(user_dogs)) FROM user_dogs),
                        'reviews', (SELECT json_agg(row_to_json(review_data)) FROM review_data),
                        'ratingStats', (SELECT row_to_json(rating_summary) FROM rating_summary)
                    ) as result
            `;

            // If no dog walker found
            if (!result[0].result.dogWalker) {
                return {
                    success: false,
                    message: 'dog walker not found',
                };
            }

            const { dogWalker, userZone, dogs, reviews, ratingStats } = result[0].result;

            // Format reviews and filter out null text reviews
            const formattedReviews = (reviews || [])
                .filter(r => r.text !== null)
                .map(r => ({
                    user_id: r.user_id,
                    username: r.username || "",
                    text: r.text,
                    rating: r.rating,
                    time: r.time
                }));

            return {
                success: true,
                dogWalkers: {
                    id: dogWalker.id,
                    name: dogWalker.name,
                    pic: dogWalker.pic,
                    tel: dogWalker.tel,
                    zone: dogWalker.zone,
                    meanRating: parseFloat(ratingStats.mean_rating.toFixed(2)),
                    ratingCount: ratingStats.rating_count,
                    reviews: formattedReviews
                },
                dogs: dogs || [],
                userZone: userZone
            };

        } catch (error) {
            console.error('Error fetching reviews:', error);
            return {
                success: false,
                message: 'Failed to fetch dog walker reviews'
            };
        }
    }
}