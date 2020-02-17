'use strict ';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt =require('jsonwebtoken');



const User = mongoose.Schema({
    name : {type :String,required:true},
    pass:{type :String,required:true},
    email:{type :String},
});

User.pre('save',async function(){
    try{
        this.pass = await bcrypt.hash(this.pass,5);
        // console.log('this.pass hashed:',this.pass)    
    }
    catch(e){
        return Promise.reject();
    }
        

})

User.statics.authenticateUser = async function(user , pass){
    console.log('user' , user)
    let foundUser = await this.findOne({name: user});
    if (foundUser){
        console.log('foundUser.pass' , foundUser.pass)
        console.log('this.pass' , pass)
        let valid = bcrypt.compare(pass,foundUser.pass);
        return valid ? foundUser : Promise.reject();
    }else{
        Promise.reject();

    }
}

User.statics.bearerAuth = async function (token){
    // try {
    //     let tokenObj = await jwt.verify(token, 'ser123');
    //     return this.findOne({id:tokenObj._id});
    // } catch(err){
    //     return Promise.reject();
    // }
    console.log('iiiiii', token);
    
    try {
    
        let tokenObj = jwt.verify(token, 'ser123');
        console.log('qqqqqqqqqqq', tokenObj);
        
        
        if (tokenObj) {
            console.log('rrrrrrrrr', Promise.resolve(tokenObj));
        // return this.find(tokenObj);

          return Promise.resolve(tokenObj);
        } else {
          return Promise.reject();
        }
      } catch (err) {
        return Promise.reject();
      }
}
module.exports = mongoose.model('User',User);