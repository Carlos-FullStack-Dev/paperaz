// Initializes the `teammembers` service on path `/teammembers`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Teammembers } from './teammembers.class';
import createModel from '../../models/teammembers.model';
import hooks from './teammembers.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'teammembers': Teammembers & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/teammembers', new Teammembers(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('teammembers');

  service.hooks(hooks);
}
