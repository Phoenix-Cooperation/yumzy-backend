const authResolvers = {
    Query: {
        users: () => {
            return new Promise((resolve, reject) => {
                fetchAllUsers((data) => {
                    resolve(data);
                });
            });
        }
    }
}

const fetchAllUsers = (callback) => {
    db.collection('users')
        .get()
        .then((item) => {
            const items = [];
            item.docs.forEach(item => {
                console.log('Adding...')
                items.push(item.data())
            });
            return callback(items);
        })
        .catch(e => console.log(e));
}




export default authResolvers;