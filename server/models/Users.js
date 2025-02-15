module.exports = (sequelize , DataTypes) =>{

    const Users = sequelize.define("Users" , {
        userName : {
            type : DataTypes.STRING,
            allowNull : false,
        },
        password : {
            type : DataTypes.STRING,
            allowNull : false,
        },
    });

    // Users.associate = (models)=>{
    //     Users.hasMany(models.Posts , {
    //         onDelete: "cascade",
    //     });
    // }
    
    Users.associate = (models)=>{
        Users.hasMany(models.Likes , {
            onDelete: "cascade",
        });
    }

    return Users;
}   