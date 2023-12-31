const client = require("./client");
const bcrypt = require ("bcrypt");
const SALT_COUNT = 12;

async function getAllUsers(){
    try{
        const {rows} = await client.query(`
        SELECT * 
        FROM users;
        `);
        return rows
    }catch (error){
        console.log("error at getAllUsers")
        throw error;
    }
}

async function createUser({email, password}){
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT)
    try{
        const {rows: [user]} = await client.query(`
        INSERT INTO users(email, password) VALUES ($1, $2)  
        RETURNING id, email, permission_id
    `, [email, hashedPassword]);
        return user;
    } catch (error){
        console.log("error at createUser-db-users.js")
        throw error;
    }
}

async function getUserByEmail({email}){
    
    try{
        const {rows} = await client.query(`
        SELECT * 
        FROM users
        WHERE email = $1;
        `, [email]);

        if(!rows) return null;
        const [user] = rows;
        return user

    }catch(error){
        console.log("error at getUserByUsername-db-users.js")
        throw error;
    }
}

async function deleteUser(userId){
    try{
        await client.query(`
        DELETE FROM users
        WHERE id=$1
        `, [userId]);
        
    }catch(error){
        console.log("error at deleteUser-db-users.js")
        throw error;
    }
}

async function editUser({ id, email, password, address_line_1, address_line_2, city, state, zip, permission }) {
    try {
        const {rows: [editUser]} = await client.query(`
            UPDATE users
            SET email = $2, password = $3, address_line_1 = $4, address_line_2 = $5, city = $6, state = $7, zip = $8, permission = $9
            WHERE id = $1
            RETURNING *;
        `, [id, email, password, address_line_1, address_line_2, city, state, zip, permission]);
        return editUser;
    } catch (error) {
        throw error;
    }
}

async function checkUserByEmail(email) {
    try {
        const {rows: [user]} = await client.query(`
            SELECT users.email FROM users
            WHERE users.email = $1
        `, [email]);
        if (user) return true;
        return false;
    } catch (error) {
        throw error;
    }
}

async function loginUser({email, password}) {
    try {
        const isUser = await checkUserByEmail(email);
        if (!isUser){
            return;
        }
        const {rows: [user]} = await client.query(`
            SELECT users.id, users.email, users.permission_id, users.password
            FROM users
            WHERE users.email = $1
        `, [email]);
        const hashedPassword = user.password;
        const passwordsMatch = await bcrypt.compare(password, hashedPassword);
        if(!passwordsMatch){
            return;
        }
        const { id, permission_id } = user;
        const userDetails = { id, email, permission_id }
        return userDetails;
    } catch (error) {
        throw error;
    }
}

async function getUserById(id){
    try {
        const {rows: [email]} = await client.query(`
            SELECT * FROM users
            WHERE id = $1
        `, [id]);
        return email;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllUsers,
    createUser,
    deleteUser,
    editUser,
    getUserByEmail,
    loginUser,
    getUserById
}