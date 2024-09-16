import Fastify from 'fastify'

const app = Fastify()

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server Running on http://localhost:3333')
  })
