// Initializes the `handleFileQue` service on path `/handle-file-que`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { HandleFileQue } from './handle-file-que.class';
import createModel from '../../models/handle-file-que.model';
import hooks from './handle-file-que.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'handle-file-que': HandleFileQue & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/handle-file-que', new HandleFileQue(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('handle-file-que');

  service.hooks(hooks);
}
