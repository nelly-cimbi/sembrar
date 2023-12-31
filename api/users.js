const express = require("express");
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');

const { getUserByEmail, createUser, getAllUsers, deleteUser, loginUser, getUserById} = require('../db');

const { JWT_SECRET = 'mySecret' } = process.env



// POST /api/users/login
usersRouter.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(401);
            next({
                name: 'MissingCredentialsError',
                message: 'Both email and password are required'
            });
        }
        const user = await loginUser({email, password});
        if(!user) {
            res.status(401);
            next({
                name: 'IncorrectCredentialsError',
                message: 'Username or password is incorrect',
            })
        } else {
            const token = jwt.sign({id: user.id, email: user.email}, JWT_SECRET, { expiresIn: '1w' });
            const parsedToken = jwt.verify(token, JWT_SECRET);
            const permission = user.permission_id
            res.send({ 
                user, 
                message: "you're logged in!",
                token,
                permission
            });
        }
    } catch (error) {
        next(error);
    }
});

// create new account
usersRouter.post("/register", async (req, res, next) => {   
    try{
        const {email, password} = req.body;
        const queryUser=await getUserByEmail(email);
        if(queryUser){
            res.status(401);
            res.send({
                name: "UserExistsError",
                message: "A user by that username already exists"
            });
        }else if(password.length < 8){
            
            res.status(401);
            res.send({
                name: "PasswordLengthError",
                message: "Password too short!"
            });
        } else {
            const user = await createUser({
                email,
                password
            });

            if (!user){
                res.send({
                    name: "UserCreateError",
                    message: "Error creating account. Please try again."
                })
            } else {
                const token = jwt.sign({id: user.id, username:user.email}, JWT_SECRET, { expiresIn: "2w"});
                const parsedToken = jwt.verify(token, JWT_SECRET);   
                res.send({ user, message: "you are signed up" + "!", token});
            }
        }
    }catch (error) {
        console.log("Error at Router.post/register-users.js:api")
        next(error)
    }
})

// get users account
usersRouter.get('/:email', async (req,res,next) => {
    const userByEmail = await getUserByEmail(req.params);
    try{
        res.send(userByEmail)
    } catch (error){
        console.log("Error at Router.get(/id)-users.js:api")
        next(error)
    }
});

//  get all users
usersRouter.get("/", async (req, res, next) => {
    try{
        const allUsers = await getAllUsers();
        res.send(allUsers)
    } catch (error){
        console.log("Error at Router.get(/)-users.js:api")
        next(error)
    }
});



usersRouter.delete("/:username",  async (req, res, next) => {

    try{
        const {email} = req.params;
        const userByEmail = await getUserByEmail(email);
        if(!userByEmail){
            next({
                name: "NotFound",
                message: "UserNotFound"
            })
        } else {
            const deleteAccount = await deleteUser({username, password})
            res.send({success: true, ...deleteAccount});
        }
    }catch (error) {
        console.log("Error at Router.delete(/username)-users.js:api")
        next(error);
    }
});

usersRouter.patch('/users/:Id', async (req, res, next) => {
    try {
        const { email, password, address_line_1, address_line_2, city, state, zip, permission } = req.body;
        const { id } = req.params;
        const userToEdit = await getUserById(userId);

        if(!userToEdit) {
                next({
                    name: 'UserNotFoundError',
                    message: `User ID ${id} not found`
            })
          } else if(req.user.id !== userToEdit.id) {
            res.status(403);
                next({
                    name: "WrongUserError",
                    message: `User ${req.user} is unable to edit this profile`
            });
          } else {
            const updatedUser = await editUser(email, password, address_line_1, address_line_2, city, state, zip, permission);
            if(updatedUser) {
              res.send(updatedUser);
            } else {
                next({
                    name: 'FailedToUpdateError',
                    message: `Error updating user ID ${id}`
              })
            }
          }
    } catch (error) {
        next(error);
    }
});

module.exports=usersRouter;