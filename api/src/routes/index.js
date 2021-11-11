const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const pokemonRouter = require('./pokemons')
const typesRouter = require('./types')
const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use('/types',typesRouter)
router.use('/pokemons',pokemonRouter)

module.exports = router;
