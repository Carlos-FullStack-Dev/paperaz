
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';
import { DEFAULT_VALUES } from '../utils/constants';
import { AllowNull } from 'sequelize-typescript';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const users = sequelizeClient.define('users', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hook: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    companyName: {
      type: DataTypes.STRING,
     allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true
      unique: 'email',
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      // unique: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    slogan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    briefIntro: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: app.get('default_password')
    },
    referralCode: {
      type: DataTypes.STRING,
      allowNull:true
    },
    role: {
      type: DataTypes.STRING,
      defaultValue:DEFAULT_VALUES.users.roles.FREE_USER
    },
    stripeCustomerId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true
    },
    signatureURL: {
      type: DataTypes.STRING,
      allowNull: true
    },
    initialURL: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: DEFAULT_VALUES.users.status.ACTIVE
    },
    subscriptionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    totalLeavesEarned: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue:0
    },
    totalCreditsEarned: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue:0
    },
    referreeId: {
      type: DataTypes.STRING,
      allowNull:true
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull:true
    },
    isReferreePaid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isTutorialPassed: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: true
    },
    mainAccountId: {
      type: DataTypes.INTEGER,
      allowNull:true
    },
    numberOfReferrals: {
      type: DataTypes.INTEGER,
      allowNull:true,
      defaultValue:0
    },
    totalPages: {
      type: DataTypes.INTEGER,
      allowNull:true,
      defaultValue:0
    },
    businessPage: {
      type: DataTypes.STRING,
      allowNull:true,
    },
    teamAccess: {
      type: DataTypes.ENUM(DEFAULT_VALUES.membersAccess.COMPANY_FILES, DEFAULT_VALUES.membersAccess.OWN_FILES),
      allowNull:true,
      defaultValue:null
    },
    socialLogin: {
       type: DataTypes.ENUM(DEFAULT_VALUES.socialLogin.GOOGLE, DEFAULT_VALUES.socialLogin.FACEBOOK, DEFAULT_VALUES.socialLogin.TWITTER),
       allowNull:true,
       defaultValue:null
    },
    socialId: { 
      type: DataTypes.STRING,
      // unique: true,
      allowNull:true,
    },
    secret:{
      type: DataTypes.STRING,
      allowNull:true,
      defaultValue:null
    },
    isAdmin:{
      type: DataTypes.BOOLEAN,
      defaultValue:false
    },
    isEmailVerified:{
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    allowCopy:{
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    teamId:{
      type: DataTypes.STRING,
      allowNull:true,
    }


  }, {
    // indexes: [{ unique:true, fields:['email'] }],
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      }
    },
    underscored: true
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (users as any).associate = function (models: any): void {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
    const {users, files, team} = models;
    users.hasMany(files)
  };

  return users;
}
