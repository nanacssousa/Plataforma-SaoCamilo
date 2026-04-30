const authService = require("./authService");

const login = async (req, res) => {
    try{
        const result = await authService.login(req.body);
        return res.json(result);
    }catch(err){
        res.status(400).json({error: err.message});
    }
};

const cadastrar = async (req, res) => {
    try{
        const result = await authService.cadastrar(req.body);
        return res.status(201).json(result);
    }catch(err){
        return res.status(400).json({error: err.message})
    }
};

module.exports = {
    login,
    cadastrar
};