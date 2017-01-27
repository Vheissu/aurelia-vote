import {Aurelia, autoinject} from 'aurelia-framework';
import {Router, RouterConfiguration} from 'aurelia-router';

import { Notification } from './services/notification';

@autoinject()
export class App {
  router: Router;

  constructor(public notification: Notification) {}

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Aurelia';
    config.map([
      { route: ['', 'home'], name: 'home', moduleId: './home', nav: true, title: 'Home' },
      { route: 'view/:id', name: 'view', moduleId: './view', nav: false, title: 'View Story' }
    ]);

    this.router = router;
  }
}
