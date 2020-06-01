export default {
    jwtSecret: process.env.JWT_SECRET || 'clavesecreta',
    DB:{
        URI:'mongodb://127.0.0.1:27017/testTutorial',
        USER:'',
        PASSWORD:''
    }
}