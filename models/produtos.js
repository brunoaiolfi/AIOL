const database = require('./database');
const empresa = require('./empresa')
const categoria = require('./categorias');

const produto = database.sequelize.define('produto',{
    nome:{ 
        type: database.Sequelize.STRING
    },
    preco:{
        type: database.Sequelize.FLOAT
    },
    qntd:{
        type: database.Sequelize.INTEGER
    },
    nome_Categoria:{
        type: database.Sequelize.STRING
    },
   
})


produto.belongsTo(empresa,{
    constraint: true, foreignKey: 'FK_empresa'
})

produto.sync({force: true})

module.exports = produto;