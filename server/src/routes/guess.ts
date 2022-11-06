
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function guessesRoutes(fastify: FastifyInstance) {
    fastify.get('/guesses/count', async () => {
        const guessesCount = await prisma.guess.count();
        return { guessesCount };
    });

    fastify.post('/pools/:poolId/games/:gameid/guesses', {
        onRequest: [authenticate]
    }, async (request, reply) => {
        const createGuessParams = z.object({
            poolId: z.string(),
            gameId: z.string()
        });

        const createGuessBy = z.object({
            firstTeamPoints: z.number(),
            secondTeamPoints: z.number()
        })

        const { poolId, gameId } = createGuessParams.parse(request.params);
        const { firstTeamPoints, secondTeamPoints } = createGuessBy.parse(request.params)


        const participant = await prisma.participant.findUnique({
            where: {
                userId_poolId: {
                    poolId,
                    userId: request.user.sub
                }
            }
        })

        if (!participant) {
            return reply.status(400).send({
                message: 'You are not allowed to create a guess inside this pool.'
            })
        }

        const game = await prisma.game.findUnique({
            where: {
                id: gameId,
            }
        })

        if(!game){
            return reply.status(400).send({
                message: 'Game not found'
            })
        }
        if(game.date > new Date()){
            return reply.status(400).send({
                message: 'You cant send a guess after the game date'
            })
        }

        await prisma.guess.create({
            data: {
                gameId,
                participantId: participant.id,
                firstTeamPoints,
                secondTeamPoints
            }
        })

        return reply.status(200).send();
    })
}


