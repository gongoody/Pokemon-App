const axios = require("axios")
const { Router } = require('express');
const {Type} = require("../db");
const router = Router();

const getApiData = async() =>{
    const apiUrl = await axios.get('https://pokeapi.co/api/v2/type')
    const types = await apiUrl.data.results.map(type => {
        return {
            name: type.name
        }
    })
    return types
}

router.get('/', async (req,res,next) =>{
    try{
        const types = await getApiData()
        const typesBd = types.map(t => {
            return Type.findOrCreate({
                where: {
                    name: t.name
                }
            })
        })
        res.status(200).send(types)
    }
    catch(error){
        next(error)
    }
})

module.exports = router;