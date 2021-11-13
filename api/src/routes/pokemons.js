const { default: axios } = require('axios');
const { Router } = require('express');
const {Pokemon, Type} = require("../db");
const router = Router();
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

//Data  from API
const apiPokedex = async () => {
    var allPokemon = []
    for(var i=1; i <= 5; i++){
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

const dbPokedex = async() =>{
    return await Pokemon.findAll({
        include: Type,
    })
}

const pokedex = async() =>{
        const apiData = await apiPokedex()
        const dbData = await dbPokedex()
        const allData = [...apiData, ...dbData]
        //console.log(allData, 'console from function pokedex')
        return allData
        
}

router.get('/', async(req,res,next)=>{
    try{
        pokeDb = await Pokemon.findAll({
            include:{
                model: Type,
            }
        });
        const pokeData = await pokedex()
        const pokeDataMap = await pokeData.map(poke => {
            return Pokemon.findOrCreate({
                where: {
                    id: poke.id,
                    name: poke.name || "No name",
                    life: poke.life || "No life data",
                    strength: poke.strength || "No strength data",
                    defense: poke.defense || "No defense data",
                    speed: poke.speed || "No speed data",
                    height: poke.height || "No height data",
                    weight: poke.weight || "No weigth data",
                    image: poke.image || "No image"
                }
            })
        })
        const name = req.query.name;
        if(name){
            const pokeSearched = await pokeDb.filter(pokemon => pokemon.name.toLowerCase().includes(name.toLowerCase()))
            pokeSearched.length ?
            res.status(200).send(pokeSearched) : res.status(404).send('The Pokemon does not exist in the database')
        }else{
            res.status(200).send(pokeData)
        }
    }
    catch(error){
        next(error)
    }
})

router.get('/:idPoke', async(req,res,next) => {
    try{
        const idPokemon = req.params.idPoke;
        const pokemon = await Pokemon.findAll({
            include: {
                model: Type,
            }
        })
        const pokeSearched = await pokemon.filter(poke => poke.id === idPokemon)
        pokeSearched.length?
        res.status(200).send(pokeSearched) : res.status(404).send('ID not found')
    }catch(error){
        next(error)
    }
})




module.exports = router;