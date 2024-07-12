// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const billings = sequelizeClient.define('billings', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    paperlink: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    teamMember: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    businessPage: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reciept: {
      type: DataTypes.STRING,
      allowNull: false
    },


  }, {
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (billings as any).associate = function (models: any): void {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
    const {users, billings} = models;
    billings.belongsTo(users)
  };

  return billings;
}
