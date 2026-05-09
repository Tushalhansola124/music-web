// const ImageKit = require("imagekit");
// const ImageKitInstance = new ImageKit({
//     publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
//     privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
//     urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
// });

// async function uploadFile(fileData) {
//     try {
//         console.log("Uploading file...");

//         const result = await ImageKitInstance.upload({
//             file: fileData,
//             fileName: "music_" + Date.now(),
//             folder: "yt-complete-backend/music"
//         });

//         return result;
//         const deleteFile = async (fileId) => {
//   return await imagekit.deleteFile(fileId);
// };

//     } catch (err) {
//         console.log("Upload error:", err.message);
//         throw err;
//     }
// }

// module.exports = { uploadFile };


const ImageKit = require("imagekit");

const ImageKitInstance = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// ✅ Upload function
async function uploadFile(fileData) {
  try {
    console.log("Uploading file...");

    const result = await ImageKitInstance.upload({
      file: fileData,
      fileName: "music_" + Date.now(),
      folder: "yt-complete-backend/music"
    });

    return result;

  } catch (err) {
    console.log("Upload error:", err.message);
    throw err;
  }
}

// ✅ Delete function (SEPARATE)
async function deleteFile(fileId) {
  try {
    return await ImageKitInstance.deleteFile(fileId);
  } catch (err) {
    console.log("Delete error:", err.message);
    throw err;
  }
}

// ✅ Export both
module.exports = { uploadFile, deleteFile };