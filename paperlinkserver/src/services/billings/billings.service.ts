// Initializes the `legals` service on path `/legals`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Billings } from './billings.class';
import createModel from '../../models/billings.model';
import hooks from './billings.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'billings': Billings & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/billings', new Billings(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('billings');

  service.hooks(hooks);
}
