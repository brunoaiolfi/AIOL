const Sequelize = require('sequelize');
const sequelize = new Sequelize('aiol', 'root', 'vbyd411910',{
    host: 'localhost',
    dialect: 'mysql',
})

sequelize.authenticate().then(()=>{
    console.log('Banco de dados conectado com sucesso!')
}).catch((err)=>{
    console.log('Erro ao conectar-se com banco de dados! '+err)
})

module.exports = {
    Sequelize : Sequelize,
    sequelize : sequelize
}
