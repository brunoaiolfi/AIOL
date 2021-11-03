const database = require('./database')
const produto = require('./produtos')
const venda = require('./compras')
const empresa = require('./empresa')


const produtoVenda = database.sequelize.define('produtoVenda',{
    qntd: database.Sequelize.INTEGER,
    nome: database.Sequelize.STRING,
    preco: database.Sequelize.FLOAT,
    precoTotal: database.Sequelize.FLOAT
})

produtoVenda.belongsTo(empresa,{
    constraint: true, foreignKey:'FK_empresa'
});

produtoVenda.belongsTo(produto,{
    constraint: true, foreignKey:'FK_produto'
});

produtoVenda.belongsTo(venda,{
    constraint: true, foreignKey:'FK_venda'
});

// produtoVenda.sync({force: true})


module.exports = produtoVenda;