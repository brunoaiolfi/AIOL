const database = require('./database')
const empresa = require('./empresa')

const categoria = database.sequelize.define('categoria',{
    nome:{
        type: database.Sequelize.STRING,
        allowNull: false
    },
    desc:{
        type: database.Sequelize.STRING,
        default: 'Sem descrição'
    }
})


categoria.belongsTo(empresa,{
    constraint: true, foreignKey: 'FK_estoque'
})

module.exports = categoria

categoria.sync({force: true})

