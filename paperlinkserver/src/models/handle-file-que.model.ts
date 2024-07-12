// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const handleFileQue = sequelizeClient.define('handle_file_que', {
    data: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    },
    pdfHeight: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pdfWidth: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pdf_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileOwner: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fileOwnerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isGuest: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    guestName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileOwnerEmail: {
      type: DataTypes.STRING,
      allowNull: false
    },
    guestEmail: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'pending',
    },

  }, {
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (handleFileQue as any).associate = function (models: any): void {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return handleFileQue;
}
