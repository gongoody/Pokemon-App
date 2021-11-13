const { default: axios } = require('axios');
const { Router } = require('express');
const {Pokemon} = require("../db");
const router = Router();
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const pokedex = async () => {
    var allPokemon = []
    for(var i=1; i <= 151; i++){
    var apiData = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}/`)
    allPokemon.push(apiData.data) }
    
    const pokemon = await allPokemon.map(pokemon => {
    return {
        id: pokemon.id,
        name: pokemon.name,
        life: pokemon.stats[0].base_stat,
        strength: pokemon.stats[1].base_stat,
        defense: pokemon.stats[2].base_stat,
        speed: pokemon.stats[5].base_stat,
        height: pokemon.height,
        weight: pokemon.weight,
        image: pokemon.sprites.other.home.front_default
    }
    })

    return pokemon
}

router.get('/', async(req,res,next)=>{
    try{
        const pokeData = await pokedex()
        const pokeDataMap = pokeData.map(poke => {
            return Pokemon.findOrCreate({
                where: {
                    name: poke.name,
                    life: poke.life,
                    strength: poke.strength,
                    defense: poke.defense,
                    speed: poke.speed,
                    height: poke.height,
                    weight: poke.weight,
                    image: poke.image
                }
            })
        })
        res.status(200).send(pokeData)
    }
    catch(error){
        next(error)
    }
})




module.exports = router;