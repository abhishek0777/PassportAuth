const express=require("express");
const expressLayouts=require("express-ejs-layouts");
const mongoose=require("mongoose");
const flash=require("connect-flash");
const session=require("express-session");
const passport=require('passport');

//Passport config
require('./config/passport')(passport);


//DB config
const db=require('./config/keys').MongoURI;

//connect to mongo
mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{console.log("Mongo DB connected..")})
.catch(err=>console.log(err));


// app init
const app=express();
//process.env , in case we host
const PORT=process.env.PORT||5000;

//template engine
app.use(expressLayouts);
app.set('view engine','ejs');

//body parser
app.use(express.urlencoded({extended:false}));


//express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,

  }))

app.use(flash());



//passport session middleware
app.use(passport.initialize());
app.use(passport.session());

//decalre global variables for color for flash messages
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash("success_msg");
    res.locals.error_msg=req.flash("error_msg");
    res.locals.error=req.flash("error");
    next();
});


//add routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users.js'));

app.listen(PORT,()=>{
    console.log(`Server listening at port ${PORT}`);
});

