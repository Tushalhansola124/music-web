const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
 firstName:{
    type:String,
    required :[true,"firstName is required"],

 },
 lastName:{
    type:String,
    required :[true,"LastName is required"],

 },
 username:{
    type:String,
    required :[true,"UserName is required"],
    unique:true
 },
 email:{
    type:String,
    required :[true,"Email is required"],
    unique:true
 },
 password:{
    type:String,
    required :[true,"Password is required"],
 },
 role:{
    type:String,
    enum:["admin","artist","user"],
    default:"user"
 },
 likedSongs:[{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
 playlists:[{ type: mongoose.Schema.Types.ObjectId, ref: "Playlist" }],
 followingArtists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artist" }]

  
},{
    timestamps: true 
  })

const userModel = mongoose.model("Users",userSchema)
module.exports = userModel;



   
