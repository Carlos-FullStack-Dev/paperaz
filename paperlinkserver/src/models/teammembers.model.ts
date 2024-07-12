// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const teammembers = sequelizeClient.define('teammembers', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    teamsId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isOwner: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    ownersId: {
      type: DataTypes.STRING,
    },
    companyName: {
      type: DataTypes.STRING,
    },
    companyFirstName: {
      type: DataTypes.STRING,
    },
    companyLastName: {
      type: DataTypes.STRING,
    },
    companyProfilePicture :{
      type: DataTypes.STRING,
    },
    businessPage :{
      type: DataTypes.STRING,
    },
    companyEmail :{
      type: DataTypes.STRING,
    },
    teamMemberEmail :{
      type: DataTypes.STRING,
    },
    status :{
      type: DataTypes.STRING,
      defaultValue: 'active'
    },
  }, {
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (teammembers as any).associate = function (models: any): void {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    const {users, teams, teammembers} = models;
    teammembers.belongsTo(users)
    teammembers.belongsTo(teams)
  };

  return teammembers;
}
