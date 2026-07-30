
const dotenv = require('dotenv');
dotenv.config();
const express=require('express');
const app=express();
const cors=require('cors');
const userRoutes=require('./routes/user.routes');
const captainRoutes=require('./routes/captain.routes');
const cookieParser=require('cookie-parser');
const connectToDb=require('./db/db');
const mapsRoutes=require('./routes/maps.routes')

const rideRoutes=require('./routes/ride.route');


connectToDb();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use('/users',userRoutes);
app.use('/captains',captainRoutes);
app.use('/maps', mapsRoutes)
app.use('/rides', rideRoutes);
app.get('/',(req,res)=>{  
    res.send('Hello');
});


module.exports=app;