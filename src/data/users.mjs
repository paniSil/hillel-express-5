import bcrypt from 'bcrypt';

export const users = [];

export const findUserByEmail = (email) => {
    return users.find(user => user.email === email);
};

export const findUserById = (id) => {
    return users.find(user => user.id === id);
};

export const createUser = async (name, email, password, age) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        id: (users.length + 1).toString(),
        name,
        email,
        age,
        password: hashedPassword,
        role: 'admin',
        resetToken: null,
        resetTokenExpiry: null
    };
    users.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};

export const comparePasswords = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};

(async () => {
    if (!findUserByEmail('test@example.com')) {
        await createUser('Test User', 'test@example.com', 'password123', '33');
        console.log('Test user created: test@example.com / password123');
    }
})();