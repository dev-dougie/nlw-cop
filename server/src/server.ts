import Fastify from 'fastify';
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { poolRoutes } from './routes/pool';
import { userRoutes } from './routes/user';
import { guessesRoutes } from './routes/guess';
import { authRoutes } from './routes/auth';
import { gameRoutes } from './routes/game';

//singleton -> reaproveita os arquivos
async function bootstrap() {
    const fastify = Fastify({
        logger: true
    });

    await fastify.register(cors, {
        origin: true
    })

    await fastify.register(jwt, {
        secret: 'nlwcopa'
    })

    fastify.register(authRoutes);

    fastify.register(gameRoutes);

    fastify.register(guessesRoutes);

    fastify.register(poolRoutes);

    fastify.register(userRoutes);


    await fastify.listen({ port: 3333, host: '0.0.0.0' });
};

bootstrap();