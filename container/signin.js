const handleSignin = (req,res,db,bcrypt) => {
     const { email, password } = req.body;
    if(!email || !password) {
      return res.status(400).json('somthing went wrong!');
    }
    db.select('email','password').from('login')
    .where('email','=',email)
    .then(data => {
        const isValid = bcrypt.compareSync(password,data[0].password);
        if(isValid) {
            return db.select('*').from('users')
            .where('email','=',email)
            .then(user => {
                res.json(user[0])
            })
            .catch(error => res.status(400).json('unable to get users'))
        }else {
            res.status(400).json('wrong credentials')
        }
    })
    .catch(error => res.status(400).json('wrong credentials'))
}

module.exports = {
    handleSignin : handleSignin
};