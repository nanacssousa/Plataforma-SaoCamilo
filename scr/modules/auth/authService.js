const users = [{id:1, email: "enzopsette@gmail.com", password: "2404"}];

const login = async ({email, password}) =>{
    const user = users.find(u=> u.email === email);
    if(!user) throw new Error ("Usuário não encontrado!");
    if(user.password != password) throw new Error ("password inválida!")

    return {
        user: {
            id: user.id,
            email: user.email
        },
        token: "fake-token"
    };
};

const cadastrar = async ({email, password}) =>{
    const existe = users.find(u => u.email === email);
    if(existe) throw new Error ("Email já existente")
    
    const newUser = {
        id: users.length + 1,
        email: email,
        password: password
    };

    users.push(newUser);

    return {
        id: newUser.id,
        email: newUser.email
    };
};

login({email: "enzopsette@gmail.com", password: "2404"});

module.exports = {
    login,
    cadastrar
};