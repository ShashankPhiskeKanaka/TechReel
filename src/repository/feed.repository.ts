import { prisma } from "../../db/prisma.js"
import type { Reel } from "../dto/reel.dto.js";

class FeedRepository {

    fetch = async (id: string): Promise<Reel[]> => {
        console.log("User Id", id);
        const reels: Reel[] = await prisma.$queryRaw`
            WITH user_data AS (
                SELECT interests FROM user_profiles WHERE user_id = ${id}::uuid
            ),
            search_params AS (
                SELECT 
                    string_agg(val, ' | ') as query_string,
                    array_agg(val)::text[] as interest_array
                FROM user_data, jsonb_array_elements_text(interests) AS val
            )
            SELECT 
                r.*,
                COALESCE(
                    (SELECT COUNT(*)::int 
                    FROM jsonb_array_elements_text(r.tags) AS t 
                    WHERE t = ANY(SELECT unnest(interest_array) FROM search_params))
                , 0) AS tag_relevance,

                CASE 
                    WHEN (SELECT query_string FROM search_params) IS NOT NULL THEN
                        ts_rank(
                            to_tsvector('english', coalesce(r.title, '') || ' ' || coalesce(r.description, '')),
                            to_tsquery('english', (SELECT query_string FROM search_params))
                        )
                    ELSE 0 
                END AS text_relevance
            FROM
                reels r
            CROSS JOIN user_data u
            LEFT JOIN reel_views rv ON rv.reel_id = r.id AND rv.user_id = ${id}::uuid
            WHERE
                r.status = 'UPLOADED'  -- New status check
                AND rv.id IS NULL
                AND (
                    (SELECT query_string FROM search_params) IS NULL
                    OR (
                        (r.tags ?| (SELECT interest_array FROM search_params))
                        OR
                        (to_tsvector('english', coalesce(r.title, '') || ' ' || coalesce(r.description, '')) @@ 
                        to_tsquery('english', (SELECT query_string FROM search_params)))
                    )
                )
            ORDER BY 
                tag_relevance DESC,
                text_relevance DESC,
                r.created_at DESC
            LIMIT 20;

            `;



        return reels;
    }

}

export { FeedRepository }