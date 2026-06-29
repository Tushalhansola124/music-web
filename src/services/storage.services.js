

// const ImageKit = require("imagekit");

// const ImageKitInstance = new ImageKit({
//   publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
//   privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
//   urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
// });

// // ✅ Upload function
// async function uploadFile(fileData) {
//   try {
//     console.log("Uploading file...");

//     const result = await ImageKitInstance.upload({
//       file: fileData,
//       fileName: "music_" + Date.now(),
//       folder: "yt-complete-backend/music"
//     });

//     return result;

//   } catch (err) {
//     console.log("Upload error:", err.message);
//     throw err;
//   }
// }

// // ✅ Delete function (SEPARATE)
// async function deleteFile(fileId) {
//   try {
//     return await ImageKitInstance.deleteFile(fileId);
//   } catch (err) {
//     console.log("Delete error:", err.message);
//     throw err;
//   }
// }

// // ✅ Export both
// module.exports = { uploadFile, deleteFile };


const ImageKit = require("imagekit");

const ImageKitInstance = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// ✅ Upload function — fileName and folder are now optional params
async function uploadFile(fileData, fileName, folder) {
  try {
    console.log("Uploading file...");

    const result = await ImageKitInstance.upload({
      file: fileData,
      fileName: fileName || "music_" + Date.now(),   // default same as before
      folder: folder || "yt-complete-backend/music",  // default same as before
    });

    return result;

  } catch (err) {
    console.log("Upload error:", err.message);
    throw err;
  }
}

// ✅ Delete function
async function deleteFile(fileId) {
  try {
    return await ImageKitInstance.deleteFile(fileId);
  } catch (err) {
    console.log("Delete error:", err.message);
    throw err;
  }
}

module.exports = { uploadFile, deleteFile };