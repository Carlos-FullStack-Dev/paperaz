// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const permissions = sequelizeClient.define('permissions', {

    fileId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fileOwnerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isGranted: {
      type: DataTypes.BOOLEAN,
     defaultValue: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },  
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    permissionUniqueId: {
      type: DataTypes.STRING,
      allowNull: true
    },

  }, {
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (permissions as any).associate = function (models: any): void {
 
  };

  return permissions;
}
