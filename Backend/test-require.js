try {
  require('./controllers/user.controller');
  require('./middlewares/auth.middleware');
  console.log('OK');
} catch (e) {
  console.error(e);
  process.exit(1);
}



{


    // "fullname":{
    //     "firstname":"test_captain_firstname",
    //     "lastname":"test_captain_lastname"
    // },
    // "email":"test_email@gmail.com",
    // "password":"test_captain",
    // "vehicle":{
    //     "color":"red",
    //     "plate":"CH 04 XY 9915",
    //     "capacity":3,
    //     "vehicleType":"car"
    // }
}