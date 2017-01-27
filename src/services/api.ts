import {autoinject} from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';

import {Story} from '../interfaces';

@autoinject()
export class Api {

    public http: HttpClient;

    constructor() {
        this.http = new HttpClient();

        this.http.configure(config => {
            config
                .useStandardConfiguration()
                .withBaseUrl('/api/');
            });
    }

    getStories(count: number = 10, offset: number = 0): Promise<any> {
        return this.http.fetch(`stories/${count}/${offset}`);
    }

    getStory(id: number): Promise<any> {
        return this.http.fetch(`story/${id}`);
    }

    getStoryVotes(id: number): Promise<any> {
        return this.http.fetch(`story/${id}/votes`);
    }

    castVote(storyId: number): Promise<any> {
        return this.http.fetch(`story/${storyId}/vote`, {
            method: 'POST'
        });
    }
}
