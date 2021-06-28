const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const googleVerify = async(token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID, // Specify the process.env.GOOGLE_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];

    const { name: nombre, email: correo, picture: img } = ticket.getPayload();

    return { nombre, correo, img};
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
}

module.exports = {
    googleVerify
}