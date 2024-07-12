// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const teams = sequelizeClient.define('teams', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    teamName: {
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
  (teams as any).associate = function (models: any): void {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    const {users, teams, teammembers} = models;
    teams.belongsTo(users)
    teams.hasMany(teammembers)
    users.hasMany(teams)
  };

  return teams;
}
