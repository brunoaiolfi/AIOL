const express = require('express');
const app = new express();
const bodyParser = require('body-parser')
const handlebars = require('express-handlebars')

const empresa = require('./models/empresa')
const cliente = require('./models/cliente')
const categoria = require('./models/categorias')
const produto = require('./models/produtos')
const compra = require('./models/compras');
const produtoVenda = require('./models/produtosCompra');


const session = require('express-session')
const flash = require('connect-flash');
const { get } = require('http');

// CONFIGURAÇÕES

    // BODY PARSER
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())

    // handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')
    app.engine('handlebars',handlebars({defaultLayout: 'main'}))
    app.use(express.static('views/public/images'));

    // SESSÃO

    app.use(session({
        secret: 'asdASDWweqeklml',
        resave: true,
        saveUninitialized: true
    }))
    app.use(flash())
    
    // middleware
    
    app.use((req,res,next)=>{
        res.locals.getEmpresaId = req.session.getEmpresaId
        res.locals.getClienteId = req.session.getClienteId
        res.locals.getCategoriaId = req.session.getCategoriaId
        res.locals.getEstoqueId = req.session.getEstoqueId
        res.locals.getProdutoId = req.session.getProdutoId
        res.locals.getCategoria = req.session.getCategoria
        res.locals.getVendaId = req.session.getVendaId
        // Vendas

            // CLiente
            res.locals.getClienteIdVenda = req.session.getClienteIdVenda
            res.locals.getClienteNomeVenda = req.session.getClienteNomeVenda
            res.locals.getClienteCpfVenda = req.session.getClienteCpfVenda

            // Produto
            res.locals.getProdutoIdVenda = req.session.getProdutoIdVenda
            res.locals.getProdutoNomeVenda = req.session.getProdutoNomeVenda
            res.locals.getProdutoQntdVenda = req.session.getProdutoQntdVenda
            res.locals.getValorTotal = req.session.getValorTotal
            res.locals.relatorioVenda = req.session.relatorioVenda

        next()
    })

// Rotas

    app.get('/', (req,res)=>{
        res.render('landingPage')
    })

    app.get('/sair',(req,res)=>{
        req.session.getEmpresaId = null
        req.session.getClienteId = null
        req.session.getCategoriaId = null
        req.session.getEstoqueId = null
        req.session.getProdutoId = null
        req.session.getCategoria = null
        req.session.getVendaId = null
        // Vendas

            // CLiente
            req.session.getClienteIdVenda = null
            req.session.getClienteNomeVenda = null
            req.session.getClienteCpfVenda = null

            // Produto
            req.session.getProdutoIdVenda = null
            req.session.getProdutoNomeVenda = null
            req.session.getProdutoQntdVenda = null
            req.session.getValorTotal = null
            req.session.relatorioVenda = null

        res.redirect('/')
    })
    app.get('/vendas',(req,res)=>{
       compra.findAll({where: {FK_empresa: req.session.getEmpresaId}}).then((compra)=>{
            res.render('admin/vendas',{compra: compra})
        })
    })

    app.get('/mostrarDetalhesVenda/:id',(req,res)=>{
        compra.findAll({where: {id:req.params.id}}).then((compra)=>{
            produtoVenda.findAll({where:{FK_venda: req.params.id}}).then((produtoVenda)=>{
                console.log(produtoVenda)
                res.render('admin/maisDetalhesVenda',{produtoVenda: produtoVenda,compra: compra})
 
            })   
        })
       
    })

    app.get('/formCadVenda',(req,res)=>{
        cliente.findAll({where: {FK_empresa: req.session.getEmpresaId}}).then((cliente)=>{
            produto.findAll({where:{FK_empresa: req.session.getEmpresaId}}).then((produto)=>{
                res.render('admin/formCadClienteVenda',{cliente: cliente,produto: produto})
 
            })   
        })
    })

    app.get('/clientes',(req,res)=>{
        cliente.findAll({where: {FK_empresa: req.session.getEmpresaId}}).then((cliente)=>{
            res.render('admin/clientes',{clientes: cliente})
        })
    })

    app.get('/categorias',(req,res)=>{
        categoria.findAll({where: {FK_estoque: req.session.getEstoqueId}}).then((categoria)=>{
            res.render('admin/categorias',{categorias: categoria})
        })
    })

    app.get('/produtos',(req,res)=>{
        produto.findAll({where: {FK_empresa: req.session.getEmpresaId}}).then((produto)=>{
            res.render('admin/produtos',{produtos : produto})
        })
    })

    app.get('/formCadProduto',(req,res)=>{
        categoria.findAll({where: {FK_estoque: req.session.getEstoqueId}}).then((categoria)=>{
            res.render('admin/formCadProduto',{categorias: categoria})
        })
    })

    app.get('/formCadCategoria',(req,res)=>{
        res.render('admin/formCadCategoria')
    })



// Cadastros

    // Cadastrar empresa
    app.post('/cadastrarEmpresa', (req,res)=>{
        const createEmpresa = empresa.findOne({
            where:{
                login: req.body.Flogin_empresa,
                cnpj: req.body.Fcnpj_empresa
            }
        }).then((createEmpresa)=>{
            if (!createEmpresa){

                var erros = []
                var sucesso = []


                if (!req.body.Fnome_empresa || 
                    typeof req.body.Fnome_empresa === undefined || 
                    req.body.Fnome_empresa == null){

                        erros.push({texto: "Nome da empresa não pode estar vazio!"})

                }
                if (!req.body.Fcnpj_empresa ||
                    typeof req.body.Fcnpj_empresa === undefined ||
                    req.body.Fcnpj_empresa == null ){

                        erros.push({texto: "CNPJ da empresa não pode estar vazio!"})
                    }
                if (!req.body.Femail_empresa ||
                    typeof req.body.Femail_empresa === undefined ||
                    req.body.Femail_empresa == null ){

                        erros.push({texto: "O email da empresa não pode estar vazio!"})
                    }
                if (!req.body.Flogin_empresa ||
                    typeof req.body.Flogin_empresa === undefined ||
                    req.body.Flogin_empresa == null ){

                        erros.push({texto: "O login da empresa não pode estar vazio!"})
                    }
                if (!req.body.Fsenha_empresa ||
                    typeof req.body.Fsenha_empresa === undefined ||
                    req.body.Fsenha_empresa == null ){

                        erros.push({texto: "A senha da empresa não pode estar vazio!"})
                    }
                else{
                    empresa.create({
                        nome_empresa: req.body.Fnome_empresa,
                        cnpj: req.body.Fcnpj_empresa,
                        email: req.body.Femail_empresa,
                        login: req.body.Flogin_empresa,
                        senha: req.body.Fsenha_empresa
                    })
                    
                    sucesso.push({texto: "Empresa cadastrada com sucesso!"})
                 
                }

                res.render('landingPage', {erros: erros, sucesso: sucesso})

                 
            }
            else{
                var erros = []
                erros.push({texto: "Empresa já existente!"})
                res.render('landingPage', {erros: erros})

            }
        })
        

    })

    
    // CADASTRAR CLIENTE
    
    app.post('/cadastrarCliente',(req,res)=>{
        const createCliente = cliente.findOne({
            where: {cpf: req.body.Fcpf_cliente,
                    FK_empresa: req.session.getEmpresaId
            }}).then((createCliente)=>{
            if (!createCliente){
                var sucesso = []

                cliente.create({
                    cpf: req.body.Fcpf_cliente,
                    nome_cliente: req.body.Fnome_cliente,
                    anoDeNascimento_cliente: req.body.FanoNasc_cliente,
                    sexo_cliente: req.body.Fsexo,
                    FK_empresa: req.session.getEmpresaId
                }).then(()=>{
                    sucesso.push({texto:"Cliente cadastrado com sucesso"})                    
                    cliente.findAll({where: {FK_empresa: req.session.getEmpresaId}}).then((cliente)=>{
                        res.render('admin/clientes',{clientes: cliente,sucesso: sucesso})
                    })

                })
            }
            else{
                var erros = []
                erros.push({texto: "Erro ao cadastrar o cliente, cliente já existente"})
                cliente.findAll({where: {FK_empresa: req.session.getEmpresaId}}).then((cliente)=>{
                    res.render('admin/clientes',{clientes: cliente,sucesso: sucesso, erros: erros})
                })
            }
        })

      
    })

    // CADASTRAR CATEGORIA NO ESTOQUE
    app.post('/addCategoria',(req,res)=>{
       
        const cadCategoria = categoria.findOne({
            where: {nome: req.body.Ftitulo_categoria,
                    FK_estoque: req.session.getEmpresaId
            }}).then((cadCategoria)=>{
            if (!cadCategoria){
                var sucesso = []

                categoria.create({
                    nome:req.body.Ftitulo_categoria,
                    desc:req.body.Fdesc_categoria,
                    FK_estoque: req.session.getEstoqueId
                }).then(()=>{
                    sucesso.push({texto:"Categoria cadastrada com sucesso"})                    
                    categoria.findAll({where: {FK_estoque: req.session.getEstoqueId}}).then((categoria)=>{
                        res.render('admin/categorias',{categorias: categoria,sucesso: sucesso})
                    })

                })
            }
            else{
                var erros = []
                erros.push({texto: "Erro ao cadastrar a categoria,a cliente já existe"})
                categoria.findAll({where: {FK_estoque: req.session.getEmpresaId}}).then((categoria)=>{
                    res.render('admin/categorias',{categorias: categoria,sucesso: sucesso, erros: erros})
                })
            }
        })
    })

    // Cadastrar produto
    app.post('/addProduto',(req,res)=>{
        
        const cadProduto = produto.findOne({
            where: {nome: req.body.Fnome,
                    FK_empresa: req.session.getEmpresaId
            }}).then((cadProduto)=>{
            if (!cadProduto){
                var sucesso = []
              
                produto.create({
                    nome:req.body.Fnome,
                    preco:req.body.Fpreco,
                    qntd: req.body.Fqntd,
                    nome_Categoria: req.body.Fcategoria,
                    FK_empresa: req.session.getEmpresaId
                }).then(()=>{
                    sucesso.push({texto:"Produto cadastrado com sucesso"})                    
                    produto.findAll({where: {FK_empresa: req.session.getEmpresaId}}).then((produto)=>{
                        res.render('admin/produtos',{produtos: produto,sucesso: sucesso})
                    })

                })
            }
            else{
                var erros = []
                erros.push({texto: "Erro ao cadastrar o produto, o produto já existe"})
                produto.findAll({where: {FK_empresa: req.session.getEmpresaId}}).then((produto)=>{
                    res.render('admin/produtos',{produtos: produto,sucesso: sucesso, erros: erros})
                })
            }
        })
    })
    
    // Cadastrar venda
    app.post('/addClienteVenda',(req,res)=>{
        req.session.getClienteIdVenda = req.body.Fcliente

        const getDadosClienteVenda = cliente.findOne({where:{id: req.session.getClienteIdVenda}}).then(
            (getDadosClienteVenda)=>{
                req.session.getClienteCpfVenda = getDadosClienteVenda.dataValues.cpf
                req.session.getClienteNomeVenda = getDadosClienteVenda.dataValues.nome_cliente
                
                const vendaId = compra.create({
                    nome_cliente: req.session.getClienteCpfVenda,
                    cpf_cliente:  req.session.getClienteNomeVenda,
                    FK_empresa: req.session.getEmpresaId,
                    FK_cliente: req.session.getClienteIdVenda
                }).then((vendaId)=>{
                    req.session.getVendaId = vendaId.dataValues.id
                    console.log(req.session.getVendaId)

                    cliente.findAll({where: {FK_empresa: req.session.getEmpresaId}}).then((cliente)=>{
                        produto.findAll({where:{FK_empresa: req.session.getEmpresaId}}).then((produto)=>{
                            res.render('admin/formCadProdutoVenda',{cliente: cliente,produto: produto})
             
                        })   
                    })
                })
               

            }
        )

        
    }) 

    app.post('/addProdVenda',(req,res)=>{
       

        req.session.getProdutoIdVenda = req.body.Fproduto

        console.log(req.session.getProdutoIdVenda)
        const getDadosProdVenda = produto.findOne({where:{id: req.session.getProdutoIdVenda}}).then(
            (getDadosProdVenda)=>{
                if (req.body.Fqntd <= getDadosProdVenda.dataValues.qntd){

                    req.session.getProdutoNomeVenda = getDadosProdVenda.dataValues.nome
                    req.session.getValorTotal =  req.session.getValorTotal + (getDadosProdVenda.dataValues.preco * req.body.Fqntd)

                    var qntdEstoque = getDadosProdVenda.dataValues.qntd - req.body.Fqntd;
                    console.log(req.session.getVendaId)

                    var precoTotalProduto = getDadosProdVenda.dataValues.preco * req.body.Fqntd
                    produtoVenda.create({
                        FK_empresa: req.session.getEmpresaId,
                        FK_produto: req.session.getProdutoIdVenda,
                        FK_venda: req.session.getVendaId,
                        qntd: req.body.Fqntd,
                        nome: req.session.getProdutoNomeVenda,
                        preco: getDadosProdVenda.dataValues.preco,
                        precoTotal: precoTotalProduto
                    })

                    produto.update({
                        qntd: qntdEstoque   
                    },{where:{id: req.session.getProdutoIdVenda}})
                    
                    req.session.relatorioVenda = (req.session.relatorioVenda+' Produto: '+req.session.getProdutoNomeVenda+'; Preço: R$ '+getDadosProdVenda.dataValues.preco+ '; QNTD: '+req.body.Fqntd)
                    
                
                        cliente.findAll({where: {FK_empresa: req.session.getEmpresaId}}).then((cliente)=>{
                            produto.findAll({where:{FK_empresa: req.session.getEmpresaId}}).then((produto)=>{
                                var sucesso = []

                                sucesso.push({texto: "Produto cadastrado a venda com sucesso!"})
                                console.log('Relatório: '+req.session.relatorioVenda + 'Vall total:' +req.session.getValorTotal)
                                var finalizarCompra = true;
                                res.render('admin/formCadProdutoVenda',{cliente: cliente,produto: produto, finalizarCompra: finalizarCompra, sucesso: sucesso})
                
                            })   
                        })
                    
                }
                else{
                    

                    cliente.findAll({where: {FK_empresa: req.session.getEmpresaId}}).then((cliente)=>{
                        produto.findAll({where:{FK_empresa: req.session.getEmpresaId}}).then((produto)=>{
                            var erros =[]

                            erros.push({texto: "Erro: A quantidade comprada é maior que a do estoque!"})
                            console.log('Relatório: '+req.session.relatorioVenda + 'Vall total:' +req.session.getValorTotal)
                            var finalizarCompra = true;
                            res.render('admin/formCadProdutoVenda',{cliente: cliente,produto: produto, finalizarCompra: finalizarCompra,erros: erros})
            
                        })   
                    })
                }
                
            })

    })

    app.get('/cadVenda',(req,res)=>{
                    compra.update({
                        nome_cliente: req.session.getClienteNomeVenda,
                        cpf_cliente: req.session.getClienteCpfVenda,
                        valor_total: req.session.getValorTotal,
                        relatorio: req.session.relatorioVenda,
                        FK_empresa: req.session.getEmpresaId,
                        FK_cliente: req.session.getClienteIdVenda,
                        
                    },{where:{id: req.session.getVendaId}}).then(()=>{
                        var sucesso = []
                        sucesso.push({texto:"Venda cadastrada com sucesso!"})

               
                        // clear
                        req.session.getClienteNomeVenda = null;
                        req.session.getClienteCpfVenda = null;
                        req.session.getValorTotal = null;
                        req.session.relatorioVenda = ' ';
                        req.session.getClienteIdVenda = null;

                        res.redirect('/vendas')
                    })
        
    })

// READS

    app.post('/searchClientes', (req,res)=>{
        let searchFor = req.body.searchFor

        console.log(searchFor)
        if (searchFor == 'id'){
                cliente.findAll({where:{id: req.body.valueSearch}}).then((cliente)=>{
                    res.render('admin/clientes',{clientes: cliente})
                })
        }
        if (searchFor == 'nome'){
            cliente.findAll({where:{nome_cliente: req.body.valueSearch}}).then((cliente)=>{
                res.render('admin/clientes',{clientes: cliente})
            }) 
        }
    })

    app.post('/searchCategorias', (req,res)=>{
        let searchFor = req.body.searchFor

        console.log(searchFor)
        if (searchFor == 'id'){
                categoria.findAll({where:{id: req.body.valueSearch}}).then((categoria)=>{
                    res.render('admin/categorias',{categorias: categoria})
                })
        }
        if (searchFor == 'nome'){
            categoria.findAll({where:{nome: req.body.valueSearch}}).then((categoria)=>{
                res.render('admin/categorias',{categorias: categoria})
            })
        }
    })

    app.post('/searchProdutos', (req,res)=>{
        let searchFor = req.body.searchFor

        console.log(searchFor)
        if (searchFor == 'id'){
                produto.findAll({where:{id: req.body.valueSearch}}).then((produto)=>{
                    res.render('admin/produtos',{produtos: produto})
                })
        }
        if (searchFor == 'nome'){
            produto.findAll({where:{nome: req.body.valueSearch}}).then((produto)=>{
                res.render('admin/produtos',{produtos: produto})
            })
        }
    })

    app.post('/searchVendas', (req,res)=>{
        let searchFor = req.body.searchFor

        console.log(searchFor)
        if (searchFor == 'id'){
                compra.findAll({where:{id: req.body.valueSearch}}).then((compra)=>{
                    res.render('admin/vendas',{compra: compra})
                })
        }
        if (searchFor == 'nome'){
            compra.findAll({where:{nome_cliente: req.body.valueSearch}}).then((compra)=>{
                res.render('admin/vendas',{compra: compra})
            })
        }
    })
// DELETES

   

    // DELETAR CLIENTE
    app.get('/deleteCliente/:id',(req,res)=>{
        cliente.destroy({where:{id: req.params.id}}).then(()=>{
            var sucesso = []
    
            sucesso.push({texto: "Cliente deletado com sucesso!"})
            
                cliente.findAll({where: {FK_empresa: req.session.getEmpresaId}}).then((cliente)=>{
                    res.render('admin/clientes',{clientes: cliente,sucesso:sucesso})
                })
            

        })
    })

    // DELETE CATEGORIA
    app.get('/deleteCategoria/:id/:nome',(req,res)=>{
        categoria.destroy({where:{id: req.params.id}}).then(()=>{
            var sucesso = []
    
            sucesso.push({texto: "Categoria deletado com sucesso!"})

            produto.update({
                nome_Categoria: 'Categoria deletada!'
            },{where: {nome_Categoria: req.params.nome}})

            categoria.findAll({where: {FK_estoque: req.session.getEmpresaId}}).then((categoria)=>{
                res.render('admin/categorias',{categorias: categoria,sucesso: sucesso})
            })
            

        })
    })

    // Delete produto
    app.get('/deleteProduto/:id',(req,res)=>{
        produto.destroy({where:{id: req.params.id}}).then((produto)=>{
            var sucesso = []

            sucesso.push({texto: "Produto deletado com sucesso!"})
        
            res.render('admin/produtos',{produtos : produto,sucesso: sucesso})
         
        })
    })
    //Delete venda
    app.get('/deleteVenda/:id',(req,res)=>{

        const getAllProdVendas = produtoVenda.findAll({where: {FK_venda: req.params.id}})
        .then((getAllProdVendas)=>{
            let qntdProdutos = getAllProdVendas

            function deleteVenda (id) {
                const getDadosProduto = produto.findOne({where:{id: id.dataValues.FK_produto}}).
                    then((getDadosProduto)=>{
                        var novaQntd = id.dataValues.qntd + getDadosProduto.dataValues.qntd

                        produto.update({
                            qntd: novaQntd,
                        
                        },{where:{id: getDadosProduto.dataValues.id}})

                        produtoVenda.destroy({where:{FK_venda: req.params.id}}).then(()=>{
                                compra.destroy({where: {id: req.params.id}}).then()
                    })
                })
                    
               
            }

            getAllProdVendas.forEach((id)=>{
                deleteVenda(id)
            })
            
            
            compra.findAll({where: {FK_empresa: req.session.getEmpresaId}}).then((compra)=>{
                    var sucesso = []
                    sucesso.push({texto:'Venda deletada com sucesso!'})
                    res.render('admin/vendas',{compra: compra, sucesso: sucesso})
                })        
            })
        
    })


// EDITS

    // EDITAR CLIENTE

    app.get('/formEditCliente/:id',(req,res)=>{
        req.session.getClienteId = req.params.id
        console.log(req.session.getClienteId)
        
        cliente.findOne({where: {id: req.session.getClienteId}}).then((cliente)=>{
            res.render('admin/formEditCliente', {cliente: cliente})
        })
    

    })

    app.post('/editCliente',(req,res)=>{
        cliente.update({
            nome_cliente: req.body.Fnome_funcionario,
            sexo_cliente: req.body.Fsexo_cliente,
            cpf: req.body.Fcpf_cliente,
            anoDeNascimento_cliente: req.body.FanoNasc_cliente
        },{where: {
            id: req.session.getClienteId
        }}).then(()=>{
            var sucesso = []
            sucesso.push({texto: "Cliente editado com sucesso!"})
            
            cliente.findAll({where: {FK_empresa: req.session.getEmpresaId}}).then((cliente)=>{
                res.render('admin/clientes',{clientes: cliente, sucesso:sucesso})
            })
        })

        
    })

    // EDITAR CATEGORIA

    app.get('/formEditCategoria/:id',(req,res)=>{
        req.session.getCategoriaId = req.params.id
        categoria.findOne({where: {id: req.session.getCategoriaId}}).then((categoria)=>{
            res.render('admin/formEditCategoria', {categoria: categoria})
        })
    })

    app.post('/editCategoria',(req,res)=>{
        categoria.update({
            nome:req.body.Ftitulo_categoria,
            desc:req.body.Fdesc_categoria,
        },{where: {
            id: req.session.getCategoriaId
        }}).then(()=>{
            var sucesso = []
            sucesso.push({texto: "Categoria editado com sucesso!"})

            produto.update({
                nome_Categoria: req.body.Ftitulo_categoria
            },{where: {nome_Categoria: req.body.nomeAntigo}}
            )
            
            categoria.findAll({where: {FK_estoque: req.session.getEstoqueId}}).then((categoria)=>{
                res.render('admin/categorias',{categorias: categoria, sucesso: sucesso})
            }) 
        })
    })

    // EDITAR PRODUTO

    app.get('/formEditProduto/:id',(req,res)=>{
        req.session.getProdutoId = req.params.id;

        categoria.findAll({where: {FK_estoque: req.session.getEmpresaId}}).then((categoria)=>{
            produto.findOne({where:{id: req.params.id}}).then((produto)=>{
                res.render('admin/formEditProduto',{categoria: categoria,produto: produto})
 
         })   
        })

    })

    app.post('/editProduto',(req,res)=>{
        produto.update({
            nome: req.body.Fnome,
            preco: req.body.Fpreco,
            qntd: req.body.Fqntd,
            nome_Categoria: req.body.Fcategoria
        },{where:{id: req.session.getProdutoId }}).then(()=>{
            var sucesso = []

            sucesso.push({texto:'Produto editado com sucesso!'})
            produto.findAll({where: {FK_empresa: req.session.getEmpresaId}}).then((produto)=>{
                res.render('admin/produtos',{produtos : produto,sucesso: sucesso})
            })
        })
    })

    // Editar venda
    app.get('/editVenda/:id',(req,res)=>{
        req.session.getVendaId = req.params.id
       
        const getAllProdVendas = produtoVenda.findAll({where:{FK_venda: req.params.id}}).then((getAllProdVendas)=>{
            function deletarProdutosVenda(arrayProdutosVenda){
                        const getDadosProduto = produto.findOne({where:{id: arrayProdutosVenda.dataValues.FK_produto}}).
                        then((getDadosProduto)=>{
                            var novaQntd = arrayProdutosVenda.dataValues.qntd + getDadosProduto.dataValues.qntd

                            produto.update({
                                qntd: novaQntd,
                            
                            },{where:{id: getDadosProduto.dataValues.id}})

                            produtoVenda.destroy({where:{FK_venda: req.session.getVendaId}}).then(()=>{})})
                    }

                    getAllProdVendas.forEach((arrayProdutosVenda)=>{
                        deletarProdutosVenda(arrayProdutosVenda)
                    })

                    cliente.findAll({where: {FK_empresa: req.session.getEmpresaId}}).then((cliente)=>{
                        produto.findAll({where:{FK_empresa: req.session.getEmpresaId}}).then((produto)=>{
                            res.render('admin/formEditClienteVenda',{cliente: cliente,produto: produto})
            
                        })   
                    })
        })
        
    })

    app.post('/editClienteVenda',(req,res)=>{
        req.session.getClienteIdVenda = req.body.Fcliente

        const getDadosClienteVenda = cliente.findOne({where:{id: req.session.getClienteIdVenda}}).then(
            (getDadosClienteVenda)=>{
                req.session.getClienteCpfVenda = getDadosClienteVenda.dataValues.cpf
                req.session.getClienteNomeVenda = getDadosClienteVenda.dataValues.nome_cliente
                
                cliente.findAll({where: {FK_empresa: req.session.getEmpresaId}}).then((cliente)=>{
                    produto.findAll({where:{FK_empresa: req.session.getEmpresaId}}).then((produto)=>{
                        res.render('admin/formEditProdutoVenda',{cliente: cliente,produto: produto})
         
                    })   
                })

            }
        )
    })

    app.post('/editProdVenda',(req,res)=>{
        req.session.getProdutoIdVenda = req.body.Fproduto

        console.log(req.session.getProdutoIdVenda)
        const getDadosProdVenda = produto.findOne({where:{id: req.session.getProdutoIdVenda}}).then(
            (getDadosProdVenda)=>{
                if (req.body.Fqntd <= getDadosProdVenda.dataValues.qntd){

                    req.session.getProdutoNomeVenda = getDadosProdVenda.dataValues.nome
                    req.session.getValorTotal =  req.session.getValorTotal + (getDadosProdVenda.dataValues.preco * req.body.Fqntd)

                    var qntdEstoque = getDadosProdVenda.dataValues.qntd - req.body.Fqntd;
                    console.log(req.session.getVendaId)

                    var precoTotalProduto = getDadosProdVenda.dataValues.preco * req.body.Fqntd
                    produtoVenda.create({
                        FK_empresa: req.session.getEmpresaId,
                        FK_produto: req.session.getProdutoIdVenda,
                        FK_venda: req.session.getVendaId,
                        qntd: req.body.Fqntd,
                        nome: req.session.getProdutoNomeVenda,
                        preco: getDadosProdVenda.dataValues.preco,
                        precoTotal: precoTotalProduto
                    })

                    produto.update({
                        qntd: qntdEstoque   
                    },{where:{id: req.session.getProdutoIdVenda}})
                    
                    req.session.relatorioVenda = (req.session.relatorioVenda+' Produto: '+req.session.getProdutoNomeVenda+'; Preço: R$ '+getDadosProdVenda.dataValues.preco+ '; QNTD: '+req.body.Fqntd)
                    
                
                        cliente.findAll({where: {FK_empresa: req.session.getEmpresaId}}).then((cliente)=>{
                            produto.findAll({where:{FK_empresa: req.session.getEmpresaId}}).then((produto)=>{
                                var sucesso = []

                                sucesso.push({texto: "Produto cadastrado a venda com sucesso!"})
                                console.log('Relatório: '+req.session.relatorioVenda + 'Vall total:' +req.session.getValorTotal)
                                var finalizarCompra = true;
                                res.render('admin/formCadProdutoVenda',{cliente: cliente,produto: produto, finalizarCompra: finalizarCompra, sucesso: sucesso})
                
                            })   
                        })
                    
                }
                else{
                    

                    cliente.findAll({where: {FK_empresa: req.session.getEmpresaId}}).then((cliente)=>{
                        produto.findAll({where:{FK_empresa: req.session.getEmpresaId}}).then((produto)=>{
                            var erros =[]

                            erros.push({texto: "Erro: A quantidade comprada é maior que a do estoque!"})
                            console.log('Relatório: '+req.session.relatorioVenda + 'Vall total:' +req.session.getValorTotal)
                            var finalizarCompra = true;
                            res.render('admin/formCadProdutoVenda',{cliente: cliente,produto: produto, finalizarCompra: finalizarCompra,erros: erros})
            
                        })   
                    })
                }
                
            })

    })

    app.get('/editVenda/:id',(req,res)=>{
        compra.update({
            nome_cliente: req.session.getClienteNomeVenda,
            cpf_cliente: req.session.getClienteCpfVenda,
            valor_total: req.session.getValorTotal,
            
            
        },{where:{id:req.session.getVendaId}}).then(()=>{
            var sucesso = []
            sucesso.push({texto:"Venda editada com sucesso!"})

            // clear
            req.session.getClienteNomeVenda = null;
            req.session.getClienteCpfVenda = null;
            req.session.getValorTotal = null;
            req.session.relatorioVenda = ' ';
            req.session.getClienteIdVenda = null;

            res.redirect('/vendas')
        })
    })
    

// LOGIN

    // login empresa
    app.post('/tryLogin',(req,res)=>{

            const loginEmpresa = empresa.findOne({where: {
                login: req.body.F_login_nome_usuario, 
                senha: req.body.F_login_senha}}).then((loginEmpresa)=>{
                    if (!loginEmpresa){
                        var erros = []
                        erros.push({texto:"Login e/ou senha incorretos!"})
                        res.render('landingPage',{erros: erros})
                    }
                    else{
                        req.session.getEmpresaId = loginEmpresa.dataValues.id; 
                        req.session.getEstoqueId = loginEmpresa.dataValues.id;
                        req.session.relatorioVenda = ' '
                        req.session.getValorTotal = 0;

                        
                        console.log(req.session.getEmpresaId)
                        var sucesso = []
                        sucesso.push({texto:"Conectado com sucesso!"})
                        
                        res.redirect('/vendas')
                    }
                }   
            )
    })



const PORT = process.env.PORT || 41890
app.listen(PORT,()=>{
    console.log('Servidor em serviço!')
})