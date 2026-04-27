const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

const User = require("./models/User");
const Bus = require("./models/Bus");
const Route = require("./models/Route");
const Booking = require("./models/Booking");

async function seedDB() {

try {

await User.deleteMany();
await Bus.deleteMany();
await Route.deleteMany();
await Booking.deleteMany();

console.log("Old Data Cleared");

/* PASSWORD */
const hash = await bcrypt.hash("password123",10);

/* USERS */
const users = await User.insertMany([

{
name:"Demo Student",
email:"student@lpu.in",
password:hash,
role:"student"
},

{
name:"Admin User",
email:"admin@lpu.in",
password:hash,
role:"admin"
},

{
name:"Demo Driver",
email:"driver@lpu.in",
password:hash,
role:"driver"
}

]);

/* ROUTES */
const routes = await Route.insertMany([

{
source:"Hostel Block A",
destination:"Academic Block",
stops:["Library","Main Gate"]
},

{
source:"Hostel Block B",
destination:"Main Gate",
stops:["Canteen","Sports Complex"]
},

{
source:"Mall Road",
destination:"Campus Center",
stops:["Law Gate"]
}

]);

/* BUSES */
const buses = await Bus.insertMany([

{
busNumber:"PB08-1234",
capacity:50,
seatsAvailable:35,
status:"active"
},

{
busNumber:"PB08-5678",
capacity:40,
seatsAvailable:28,
status:"active"
},

{
busNumber:"PB08-7777",
capacity:60,
seatsAvailable:42,
status:"inactive"
}

]);

/* BOOKINGS */
await Booking.insertMany([

{
userId:users[0]._id,
busId:buses[0]._id,
routeId:routes[0]._id,
seatNumber:5,
status:"confirmed"
},

{
userId:users[0]._id,
busId:buses[1]._id,
routeId:routes[1]._id,
seatNumber:8,
status:"confirmed"
}

]);

console.log("✅ Database Seeded Successfully");
console.log("Student: student@lpu.in / password123");
console.log("Admin: admin@lpu.in / password123");
console.log("Driver: driver@lpu.in / password123");

process.exit();

} catch(err) {

console.log(err);
process.exit();

}

}

seedDB();