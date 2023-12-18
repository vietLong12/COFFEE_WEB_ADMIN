const list = [
    {
        _id: '657140fd3d4c13d7f9534bd7',
        username: 'ac',
        password: 'default1',
        avatar: 'https://www.seiu1000.org/sites/main/files/main-images/camera_lense_0.jpeg',
        email: 'admin@gmail.com',
        phone: '09875'
    },
    {
        _id: '657140fd3d4c13d7f9534bd7',
        username: 'user1',
        password: 'default1',
        avatar: 'https://www.seiu1000.org/sites/main/files/main-images/camera_lense_0.jpeg',
        email: 'user2@gmail.com',
        phone: '0123216895'
    },
    {
        _id: '657140fd3d4c13d7f9534bd7',
        username: 'user1',
        password: 'default1',
        avatar: 'https://www.seiu1000.org/sites/main/files/main-images/camera_lense_0.jpeg',
        email: 'user1@gmail.com',
        phone: '0123216895'
    },
    {
        _id: '657140fd3d4c13d7f9534bd7',
        username: 'user1',
        password: 'default1',
        avatar: 'https://www.seiu1000.org/sites/main/files/main-images/camera_lense_0.jpeg',
        email: 'user1@gmail.com',
        phone: '0123216895'
    },
    {
        _id: '657140fd3d4c13d7f9534bd7',
        username: 'user1',
        password: 'default1',
        avatar: 'https://www.seiu1000.org/sites/main/files/main-images/camera_lense_0.jpeg',
        email: 'user1@gmail.com',
        phone: '0123216895'
    },
    {
        _id: '657140fd3d4c13d7f9534bd7',
        username: 'user1',
        password: 'default1',
        avatar: 'https://www.seiu1000.org/sites/main/files/main-images/camera_lense_0.jpeg',
        email: 'user1@gmail.com',
        phone: '0123216895'
    },
    {
        _id: '657140fd3d4c13d7f9534bd7',
        username: 'user1',
        password: 'default1',
        avatar: 'https://www.seiu1000.org/sites/main/files/main-images/camera_lense_0.jpeg',
        email: 'user1@gmail.com',
        phone: '0123216895'
    }
];

const generateUniqueID = () => '_' + Math.random().toString(36).substr(2, 9);
for (let i = 0; i < 200; i++) {
    list.push({
        _id: generateUniqueID(),
        username: generateUniqueID(),
        password: Math.floor(Math.random() * 10) + generateUniqueID(),
        avatar: 'https://www.seiu1000.org/sites/main/files/main-images/camera_lense_0.jpeg',
        email: 'user' + generateUniqueID() + '@gmail.com',
        phone: '09875' + Math.floor(Math.random() * 99999)
    });
}
// Loop through the list to modify entries
export const data = list.map((entry, index, array) => {
    return {
        ...entry,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        password: generateUniqueID() + entry.password,
        email: generateUniqueID() + entry.email,
        username: entry.username + generateUniqueID(),
        id: index + generateUniqueID()
    };
});
