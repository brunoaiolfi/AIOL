const database = require('./database');

const empresa = database.sequelize.define('empresa',{
    nome_empresa:{
        type: database.Sequelize.STRING,
        allowNull: false,
    },
    cnpj:{
        type: database.Sequelize.CHAR(18),
        allowNull: false
    },
    email:{
        type: database.Sequelize.STRING,
        allowNull: false

    },
    login:{
        type: database.Sequelize.STRING,
        allowNull: false
    },
    senha:{
        type: database.Sequelize.STRING,
        allowNull: false,
    }    
})

// empresa.sync({force:true})

module.exports = empresa;

