const Sequelize = require('sequelize');
const sequelize = new Sequelize('aiol', 'brunoaiolfi', 'vbyd411910',{
    host: 'mysql380.umbler.com',
    dialect: 'mysql'
})

sequelize.authenticate().then(()=>{
    console.log('Banco de dados conectado com sucesso!')
}).catch(()=>{
    console.log('Erro ao conectar-se com banco de dados!')
})

module.exports = {
    Sequelize : Sequelize,
    sequelize : sequelize
}
