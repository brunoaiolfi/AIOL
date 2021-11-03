const database = require('./database');
const empresa = require('./empresa')

const cliente = database.sequelize.define('clientes',{
    cpf:{
        type: database.Sequelize.STRING,
        allowNull: false
    },
    nome_cliente:{
        type: database.Sequelize.STRING,
        default: 'Cliente'
    },
    dataNasc_cliente:{
        type: database.Sequelize.DATE
    },
    sexo_cliente:{
        type:database.Sequelize.STRING
    }

})

cliente.belongsTo(empresa,{
    constraint: true, foreignKey: 'FK_empresa'
})

// cliente.sync({force: true})

module.exports = cliente

