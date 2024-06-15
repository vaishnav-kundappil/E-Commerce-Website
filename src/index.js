const express = require("express")
const path = require("path")
const app = express()
let methodoverride = require('method-override')
let bodyParser=require('body-parser')
let session = require('express-session');
let flash = require('connect-flash')
let multer=require('multer')
//const hbs = require("hbs")
const LogInCollection = require("./logindb")
const admLogin = require("./admdb")
let empmodel = require("../model/model")
let Prodmodel = require("../model/prod-model")
let Transacmodel = require("../model/transac-model")
let ContactModel = require("../model/contact-model")
let PaymentModel = require("../model/payment")


const { default: mongoose } = require("mongoose")

const port = process.env.PORT || 3000
app.use(express.json())
app.use(express.static("./"));
app.use(express.urlencoded({ extended: false }))

app.use(bodyParser.urlencoded({ extended: true }))

app.use(methodoverride('_method'))

// session middleweare
app.use(session({
    secret: 'nodejs',
    resave:true,
    saveUninitialized:true
 }))
 //flash middleweare
 app.use(flash())

//globaly variable set for operation (like sucess , error) message
app.use((req, res, next)=>{
    res.locals.sucess = req.flash('sucess'),
    res.locals.err = req.flash('err')
    next()
   })

const tempelatePath = path.join(__dirname, '../templates')
const publicPath = path.join(__dirname, '../public')

//console.log(publicPath);

//app.set('view engine', 'hbs')
app.set('views', tempelatePath)

app.set('view engine', 'ejs')
//app.set('views', tempelatePath2)
app.use(express.static(publicPath))

//image storage allocation and filename

let storage=multer.diskStorage({
    destination :'public/images/',
    filename : (req, file, cb)=>{
        cb(null, file.originalname)
    }
})

let upload=multer({
    storage: storage,
    fileFilter: (req, file, cb)=>{
        if(file.mimetype=='image/jpeg' || file.mimetype=='image/jpg' || file.mimetype=='image/png' || file.mimetype=='image/gif'){
            cb(null,true)
        }
        else{
            cb(null,false);
            return cb(new Error('only jpg,jpeg,png,gif image allowed'))
        }
    }
})


mongoose.connect('mongodb://0.0.0.0:27017/LoginFormPractice')
.then(() =>{
    console.log('mongoose connected');
})
.catch((e) =>{
    console.log('failed');
})





//transactin begin
// app.get('/transaction', (req, res) => {
//     res.render('transaction')
// })

app.post('/:di/add-transaction/:id',async (req, res)=>{
    let data = {
        id : req.body.id,
        prod_name :req.body.prod_name,
        category :req.body.category,
        price :req.body.price,
        email : req.body.email,
        count :req.body.count,
        name :req.body.name,
        address :req.body.address
    }
     const x=await Transacmodel.create(data)
     const details= await LogInCollection.findOne({email:req.params.di})
     try{
        req.flash('sucess', 'Product added to transaction')
       // console.log(x)
      // res.render('product',{x:x,details:details})
       res.redirect("/product/"+ req.body.email)
     }
   
        
    
    catch{
        req.flash('err', 'Your Data has not created on Database')
       // res.render('product')
      
    }
})

// app.get('/transaction', (req, res) => {
//     Transacmodel.find({})
//     .then((x)=>{
//         console.log(x)
//         res.render('transaction', {x})
//     })
// })

app.get('/transaction/:id',async (req, res) => {
    const x=await Transacmodel.find({email:req.params.id})
    const check=await LogInCollection.findOne({email:req.params.id})
     try{
         res.render("transaction",{x:x,check:check})
     }
     catch{
         res.send("error")
     }
 })
 
 app.get('/history/:id',async (req, res) => {
    const x=await PaymentModel.find({email:req.params.id})
  
     try{
         res.render("history",{x:x,})
     }
     catch{
         res.send("error")
     }
 })


//transactin close





app.get('/', async (req, res) => {
    res.render('login')
})

app.get('/:id/payment/:di', async (req, res) => {
    const details=await LogInCollection.findOne({email:req.params.id})
    const check=await Transacmodel.findOne({id:req.params.di})
    try{
        res.render('payment',{check:check,details:details})
    }
    catch{
        res.send("error")
    }
})


// app.get('/admprod', (req, res) => {
//     res.render('product')
// })
app.get('/emp', (req, res) => {
    empmodel.find({})
    .then((x)=>{
        res.render('emp', {x})
    })
})
app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/admLogin', (req, res) => {
    res.render('admLogin')
})
app.get('/login/:id', async (req, res) => {
    const check=await LogInCollection.findOne({email:req.params.id})
    try{
        res.render('login',{details:check})
    }
    catch{
        res.send("error")
    }
})
// // app.get('/', (req, res) => {
// //     res.render('admLogin')
// })
// app.get('/add-transaction', (req, res) => {
//     res.render('add-transaction')
// })
app.get('/product/:id',async (req, res) => {
   const pro=await Prodmodel.find({})
   const check=await LogInCollection.findOne({email:req.params.id})
    try{
        res.render("product",{x:pro,check:check})
    }
    catch{
        res.send("error")
    }
})

app.get('/adm-product', (req, res) => {
    Prodmodel.find({})
    .then((x)=>{
        res.render('adm-product', {x})
    })
})

app.get('/admprod', (req, res) => {
    Prodmodel.find({})
    .then((x)=>{
        res.render('adm-product', {x})
    })
})
// app.get('/contact', (req, res) => {
//     res.render('/employee')
// })

app.get('/adm-home', (req, res) => {
    res.render('adm-home')
})

// app.get('/contact', (req, res) => {
//     res.render('contact')
// })

app.get('/home/:id', async (req, res) => {
    const check=await LogInCollection.findOne({email:req.params.id})
    res.render('home',{details:check})
})


// app.get('/adm-product', (req, res)=>{
//     res.render('adm-product')
//  })

 app.get('/adm-prod-add',(req, res)=>{
    res.render('adm-product-add-file')
 })
 app.post('/add-prod-add', upload.single('image'),(req, res)=>{
    if(!req.file){
        let data = {
            id : req.body.id,
            prod_name :req.body.prod_name,
            category :req.body.category,
            price :req.body.price,
            image :req.file.filename
        }
        
        Prodmodel.create(data)
        .then((x)=>{
            req.flash('sucess', 'Your Data has created on Database')
            //console.log(x)
            res.redirect('/admprod')
        })
        .catch((y)=>{
            req.flash('err', 'Your Data has not created on Database')
            res.redirect('/admprod')
          
        })
    }
    else{
        let data = {
            id : req.body.id,
            prod_name :req.body.prod_name,
            category :req.body.category,
            price :req.body.price
           // image :req.file.filename
        }
        
        Prodmodel.create(data)
        .then((x)=>{
            req.flash('sucess', 'Your Data has created on Database')
            //console.log(x)
            res.redirect('/admprod')
        })
        .catch((y)=>{
            req.flash('err', 'Your Data has not created on Database')
            res.redirect('/admprod')
          
        })
    }
   
})
app.get('/adm-prod-search', (req, res)=>{
    res.render('adm-product-search-file', {x:''})
 })
 
 app.get('/searchprod', (req, res)=>{
    let readquery = req.query.prod_name
    // console.log(readquery)
    Prodmodel.findOne({prod_name:readquery})
    .then((x)=>{
        res.render('adm-product-search-file', {x})
        console.log(x)
    })
    
})


app.get('/add-employ', (req, res)=>{
    res.render('add-file')
 })
 app.post('/add-employ', (req, res)=>{
    let data = {
        Name : req.body.name,
        Designation :req.body.designation,
        Salary :req.body.salary
    }
    empmodel.create(data)
    .then((x)=>{
        req.flash('sucess', 'Your Data has created on Database')
        res.redirect('/emp')
    })
    .catch((y)=>{
        req.flash('err', 'Your Data has not created on Database')
        res.redirect('/emp')
      
    })
})


 app.get('/search', (req, res)=>{
    res.render('search-file', {x:''})
 })
 
 app.get('/employee', (req, res)=>{
    let readquery = req.query.name
    // console.log(readquery)
    empmodel.findOne({Name:readquery})
    .then((x)=>{
        res.render('search-file', {x})
        console.log(x)
    })
    
})

//employee edit and delete

app.get('/edit/:id', (req, res)=>{
    let readquery = req.params.id;
   
    empmodel.findOne({Name:readquery})
    .then((x)=>{
        res.render('update-file', {x})
    })
   
})



app.put('/edit/:id', (req, res)=>{
    let readquery = req.params.id;
    empmodel.updateOne({Name:readquery}, {
        $set:{
            Name:req.body.name,
            Designation:req.body.designation,
            Salary:req.body.salary,
        }
    })
    .then((x)=>{
        req.flash('sucess', 'Your Data has updated')
        res.redirect('/emp')
    })
    .catch((y)=>{
        console.log(y)
    })
})

app.delete('/delete/:id', (req, res)=>{
    empmodel.deleteOne({Name:req.params.id})
    .then((x)=>{
        req.flash('sucess', 'Your Data has deleted')
        res.redirect('/emp')
    })
    .catch((y)=>{
        console.log(y)
    })
})

//adm product edit and delete


app.get('/edit1/:idd',(req, res)=>{
    let readquery = req.params.idd;
   
    Prodmodel.findOne({id:readquery})
    .then((x)=>{
        console.log(x)
        res.render('adm-product-update-file', {x})
    })
   
})

app.put('/edit1/:idd',  upload.single('image'),(req, res)=>{
    if(req.file)
    {
        let readquery = req.params.idd;
        Prodmodel.updateOne({id:readquery}, {
            $set:{
                id:req.body.id,
                prod_name:req.body.prod_name,
                category:req.body.category,
                price:req.body.price,
                image :req.file.filename
            }
        })
        .then((x)=>{
            req.flash('sucess', 'Your Data has updated')
            res.redirect('/adm-product')
        })
        .catch((y)=>{
            console.log(y)
        })
    }
    else{
        
        let readquery = req.params.idd;
        Prodmodel.updateOne({id:readquery}, {
            $set:{
                id:req.body.id,
                prod_name:req.body.prod_name,
                category:req.body.category,
                price:req.body.price
               // image :req.file.filename
            }
        })
        .then((x)=>{
            req.flash('sucess', 'Your Data has updated')
            res.redirect('/adm-product')
        })
        .catch((y)=>{
            console.log(y)
        })
    }
   
})

app.delete('/delete1/:idd', (req, res)=>{
    Prodmodel.deleteOne({id:req.params.idd})
    .then((x)=>{
        req.flash('sucess', 'Your Data has deleted')
        res.redirect('/adm-product')
    })
    .catch((y)=>{
        console.log(y)
    })
})

//add product to transaction

app.get('/:di/add-transaction/:id', async (req, res)=>{
    let readquery = req.params.id;
   const check = await LogInCollection.findOne({email:req.params.di})
    const x=await Prodmodel.findOne({id:readquery})
   try{
        res.render("add-transaction",{x:x,details:check})
   }
   catch{
    res.send("error")
   }
})


//adm transaction table opening from adm home

app.get('/adm-transaction', (req, res) => {
    Transacmodel.find({})
    .then((x)=>{
        res.render('adm-transaction', {x})
    })
})

//adm customer table opening from adm home

app.get('/adm-customer', (req, res) => {
    LogInCollection.find({})
    .then((x)=>{
        res.render('adm-customer', {x})
    })
})

//customer add

app.get('/customer-add-page', (req, res)=>{
    res.render('adm-customer-add')
 })
app.post('/customer-add', (req, res)=>{
    let data = {
        name :req.body.name,
        password :req.body.password,
        email :req.body.email
    }
    
    LogInCollection.create(data)
    .then((x)=>{
        req.flash('sucess', 'Your Data has created on Database')
        res.redirect('/adm-customer')
    })
    .catch((y)=>{
        req.flash('err', 'Your Data has not created on Database')
        res.redirect('/adm-customer')
      
    })
})

//customer edit and delete

app.get('/edit-cust/:email', (req, res)=>{
    let readquery = req.params.email;
   
    LogInCollection.findOne({email:readquery})
    .then((x)=>{
        res.render('adm-customer-update', {x})
    })
   
})



app.put('/edit-cust/:email', (req, res)=>{
    let readquery = req.params.email;
    LogInCollection.updateOne({email:readquery}, {
        $set:{
            name:req.body.name,
            password:req.body.password,
            email:req.body.email,
        }
    })
    .then((x)=>{
        req.flash('sucess', 'Your Data has updated')
        res.redirect('/adm-customer')
    })
    .catch((y)=>{
        console.log(y)
    })
})

app.delete('/delete-cust/:email', (req, res)=>{
    LogInCollection.deleteOne({email:req.params.email})
    .then((x)=>{
        req.flash('sucess', 'Your Data has deleted')
        res.redirect('/adm-customer')
    })
    .catch((y)=>{
        console.log(y)
    })
})


app.post('/signup', async (req, res) => {

    const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
        
       
    }

    const checking = await LogInCollection.findOne({ email: req.body.email })

   try{
    if (checking) {
        res.send("user details already exists")
    }
    else{
        await LogInCollection.insertMany([data])
    }
   }
   catch{
    res.send("wrong inputs")
   }

    res.status(201).render("login", {
        naming: req.body.email
    })
})


app.post('/login', async (req, res) => {

    try {
        const check = await LogInCollection.findOne({ email: req.body.email })

        if (check.password === req.body.password) {
            res.redirect('/home/' + check.email)
            //res.status(201).render("home", { details:check })
        }

        else {
            res.send("incorrect password")
        }


    } 
    
    catch (e) {

        res.send("wrong details")
        

    }
})

app.post('/admLogin', async (req, res) => {

    try {
        const check = await admLogin.findOne({ email: req.body.email })

        if (check.password === req.body.password && check.name === req.body.name && check.email === req.body.email)
         {
        
                res.status(201).render("adm-home", { naming: `${req.body.password}+${req.body.name}+${req.body.email}` })
        
         }
        else {
          if(check.name != req.body.name)
            {
            res.send("incorrect code");
            }
           else if(check.email != req.body.email)
            {
            res.send("incorrect email");
            }
           else if(check.password != req.body.password)
            { 
            res.send("incorrect password");
            }
        }
    

}
    
    catch (e) {
        res.send("wrong details")
    }


})

//contact page

// app.get('/contact', (req, res) => {
//     res.render('contact')
// })

app.get('/contact/:id',async (req, res) => {
    // const pro=await Prodmodel.find({})
    const check=await LogInCollection.findOne({email:req.params.id})

         res.render("contact",{details:check})
   
 
 })

app.post('/contact/:id', async (req, res) => {
    const details=await LogInCollection.findOne({email:req.params.id})
    const data = {
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        feedback: req.body.feedback
        
       
    }
    try{
   

        await ContactModel.insertMany([data])

    }
   catch{
    res.send("wrong inputs")
   }
   req.flash('sucess', 'Your feedack has sent')
   res.redirect("/home/"+ req.body.email)
})

//payment post


app.post('/pay/:id',upload.single('image'), async (req, res) => {
       
    const data = {
        name: req.body.name,
        prodid: req.body.prodid,
        prodname: req.body.prodname,
        email: req.body.email,
        count: req.body.count,
        price: req.body.price,
        amount: req.body.result,
        picture:req.file.filename,
        transac_id: req.body.id
    }
    //const check = await LogInCollection.findOne({ phone: req.params.id })
    try{
   console.log(data)
         await PaymentModel.insertMany([data])
    
    }
    catch{
        res.send("wrong inputs")
       }
       res.redirect('/home/'+ req.body.email)
      // res.render("bus_booking",{details:check})
})

app.listen(port, () => {
    console.log('port connected');
})

