import User from '../models/User.js';

export const getUser = async (req, res) => {
    try {
        // find a user with the given id
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json({
            success: true,
            user
        });

    } catch (err) {
        res.status(404).json({
            msg: 'User not found.'
        });
    }
}

export const getUserFriends = async (req, res) => {
    try {

        const { id } = req.params;
        const user = await User.findById(id);
        const friends = await Promise.all(
            user.friends.map((id) => {
                return User.findById(id);
            })
        );

        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );

        res.status(200).json({
            success: true,
            friends: formattedFriends
        });

    } catch (err) {
        console.log(err);
        res.status(404).json({
            success: false,
            msg: err.message
        });
    }
}

export const addRemoveFriend = async (req, res) => {
    try {
        
        const {id, friendId} = req.params;
        // const user = await User.findById(id);
        // const friend = await User.findById(friendId);
        const {user, friend} = await Promise.all([
            User.findById(id), User.findById(friendId)
        ]);

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => {
                return id !== friendId;
            });
            friend.friends = friend.friends.filter((id) => {
                return id !== id;
            });
        } else  {
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        await Promise.all([
            user.save(), friend.save()
        ]);

        const friends = await Promise.all(
            user.friends.map((id) => {
                return User.findById(id);
            })
        );

        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );

        res.status(200).json({
            success: true,
            friends: formattedFriends
        });
    } catch (err) {
        console.log(err);
        res.status(404).json({
            success: false, 
            msg: err.message
        });
    }
}