import {Story} from './interfaces';

import {autoinject} from 'aurelia-framework';

import { Api } from './services/api';
import { Notification } from './services/notification';

@autoinject()
export class Home {

    public stories: Story[];

    constructor(public api: Api, public notification: Notification) {  }

    activate(params, routeConfig, navigationInstruction) {
        return new Promise((resolve, reject) => {
            this.api.getStories().then(stories => stories.json()).then(stories => {
                this.stories = stories;
                resolve(stories);
            }).catch(e => {
                this.notification.error('Stories could not be loaded.');
                resolve();
            });
        });
    }

    attached() {

    }

}
