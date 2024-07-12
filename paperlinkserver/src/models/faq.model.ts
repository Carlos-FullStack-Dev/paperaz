// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const faq = sequelizeClient.define('faq', {
    question: {
      type: DataTypes.TEXT('medium'),
      allowNull: false
    },
    answer: {
      type: DataTypes.TEXT('medium'),
      allowNull: false
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    for: {
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
  (faq as any).associate = function (models: any): void {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
    const {categories, faq} = models;
    faq.belongsTo(categories)
  };

  return faq;
}
