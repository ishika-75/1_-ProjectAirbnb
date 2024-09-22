const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const sampleListings = require("./init/data.js");  // Import sample listings

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.get("/",(req,res)=>{
    res.send("Hi , I am root");
});

// app.get("/listings",async(req,res)=>{
//   const allListings=  await Listing.find({});
//   res.render("/listings/index.ejs",{allListings});   

// });
// Updated root route to render the index page with sample listings
app.get("/", (req, res) => {
    console.log("Sample Listings:", sampleListings);
    res.render("listings/index.ejs", { listings: sampleListings });
});
//index route
app.get("/listings",async(req,res)=>{
  const allListings=  await Listing.find({});
 res.render("listings/index.ejs",{allListings});
});
//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
 });
// show route 
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});
//create route
app.post("/listings",async(req,res)=>{
 //let{title,description,image,price,country,location}=req.body;
  
 const newListing= new Listing(req.body.listing);
 await newListing.save();
  res.redirect("/listings");
  

});
//edit route 
app.get("/listings/:id/edit",async(req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});
});
//update route 
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});
//DELETE ROUTE
app.delete("/listings/:id",async(req,res)=>{
let {id}=req.params;
let deletedListing=await Listing.findByIdAndDelete(id);
console.log(deletedListing);
res.redirect("/listings");

});

// app.get("/testListing",async(req,res)=>{
   
//         let sampleListing = new Listing({
//             title: "My New Villa",
//             description: "By the Beach",
//             // Uncomment and ensure the URL is valid
//             image: {
//                 type: String,
//                 default: "https://images.unsplash.com/photo-1445288962990-fcb0ae08ec1d?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//                 set: (v) => (v === "" ? "https://images.unsplash.com/photo-1445288962990-fcb0ae08ec1d?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v),
//             },
//             price: 1200,
//             location: "Calangute, Goa",
//             country: "India",
//         });
//         await sampleListing.save();
//         console.log("Sample was saved");
//         res.send("Successful testing");
    
// });
// await sampleListing.save();

// console.log("sample was saved");
// res.send("successful testing");
// });
app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});
