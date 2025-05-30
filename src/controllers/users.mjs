import { users } from "../data/users.mjs";

const getUsersHandler = (req, res) => {
    const theme = req.cookies.theme || 'light';
    res.render('users.pug', { users: users, theme: theme, user: req.user });
}

const postUsersHandler = (req, res) => {
    const { name, email, age } = req.body;
    const newUser = { id: (users.length + 1).toString(), name, email, age };

    if (newUser && newUser.name) {
        users.push(newUser)
        res.status(201).send('Post users route')
    } else {
        res.status(400).send('Bad Request')
    }
}

const getUserByIdHandler = (req, res) => {
    const userId = req.params.id;
    const userProfile = users.find(u => u.id === userId);
    const theme = req.cookies.theme || 'light';
    if (userProfile) {

        console.log('User found:', userProfile)
        res.render('user-profile.pug', { userProfile: userProfile, theme: theme, user: req.user })
    } else {
        res.status(404).send('Not Found')
    }
}

const putUserByIdHandler = (req, res) => {
    const userId = req.params.id;
    const { name, email, age } = req.body;

    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
        if (!name && !email && !age) {
            return res.status(400).json({ message: 'No data provided for update.' });
        }
        users[userIndex] = {
            ...users[userIndex],
            ...(name && { name }),
            ...(email && { email }),
            ...(age && { age })
        };
        res.status(200).json({ message: `User ${userId} updated successfully!`, user: users[userIndex] });

    } else {
        res.status(404).json({ message: 'User Not Found' });
    }
}

const deleteUserByIdHandler = (req, res) => {
    const userId = req.params.id;
    const initialLength = users.length;

    users = users.filter(u => u.id !== userId);

    if (users.length < initialLength) {
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'User Not Found' });
    }
};

export { getUsersHandler, postUsersHandler, getUserByIdHandler, putUserByIdHandler, deleteUserByIdHandler }
