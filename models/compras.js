const database = require('./database')
const cliente = require('./cliente')
const empresa = require('./empresa')
const produto = require('./produtos')

const compra = database.sequelize.define('compras',{
    nome_cliente:{
        type : database.Sequelize.STRING
    },
    cpf_cliente:{
        type : database.Sequelize.STRING
    },
    valor_total:{
        type : database.Sequelize.FLOAT
    },

})

compra.belongsTo(empresa,{
    constraint: true, foreignKey: 'FK_empresa'
})
compra.belongsTo(cliente,{
    constraint: true, foreignKey: 'FK_cliente'
})


// compra.sync({force: true})

module.exports = compra
