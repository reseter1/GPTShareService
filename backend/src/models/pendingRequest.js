module.exports = (sequelize, DataTypes) => {
    const PendingRequest = sequelize.define('PendingRequest', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        request_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        status: {
            type: DataTypes.ENUM('pending', 'confirmed', 'expired', 'rejected'),
            defaultValue: 'pending',
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'pending_requests',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    PendingRequest.associate = function (models) {
        PendingRequest.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    };

    return PendingRequest;
};
