// const mongoose = require("mongoose");


// const userSchema = new mongoose.Schema({
//  firstName:{
//     type:String,
//     required :[true,"firstName is required"],

//  },
//  lastName:{
//     type:String,
//     required :[true,"LastName is required"],

//  },
//  username:{
//     type:String,
//     required :[true,"UserName is required"],
//     unique:true
//  },
//  email:{
//     type:String,
//     required :[true,"Email is required"],
//     unique:true
//  },
//  password:{
//     type:String,
//     required :[true,"Password is required"],
//  },
//  role:{
//     type:String,
//     enum:["admin","artist","user"],
//     default:"user"
//  },
//  likedSongs:[{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
//  playlists:[{ type: mongoose.Schema.Types.ObjectId, ref: "Playlist" }],
//  followingArtists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artist" }]

  
// },{
//     timestamps: true 
//   })

// const userModel = mongoose.model("Users",userSchema)
// module.exports = userModel;




    const mongoose = require("mongoose");

    const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"]
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true
    },
    mobileNumber:{
        type:String,
        required: [true, "MobileNumber is required"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    profileImage:{
        type:String,
        
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
      
    otp: {
    type: String,
    default: null,
     },

    otpExpire: {
    type: Date,
    default: null,
    },
    role: {
        type: String,
        enum: ["admin", "artist", "user"],
        default: "user"
    },
    //   isActive: {
    //   type: Boolean,
    //   default: true,    
    // },
        likedSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song", default: [] }],
        playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Playlist", default: [] }],
        followingArtists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artist", default: [] }]
    }, {
    timestamps: true
    });
    const userModel = mongoose.model("Users",userSchema)
    module.exports = userModel;