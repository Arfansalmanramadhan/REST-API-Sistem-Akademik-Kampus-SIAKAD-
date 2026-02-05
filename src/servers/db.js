const mongoose = require( "mongoose");
async function ConnectDB() {
    await mongoose.connect(process.env.DB)
    // await mongoose.connect(process.env.DB)
    .then((result) => {
        console.log(`hubungkan ke MongoDc`)
    })
    .catch((err) => {
        console.log(err)
    })
}
module.exports = ConnectDB;