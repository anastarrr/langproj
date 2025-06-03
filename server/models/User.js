import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import bcrypt from 'bcrypt';

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: DataTypes.STRING,
    lastname: DataTypes.STRING,
    age: DataTypes.INTEGER,
    gender: DataTypes.INTEGER
}, {
    timestamps: true
});

User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

export default User;