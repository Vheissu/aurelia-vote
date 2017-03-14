import {lazy} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

interface IUser {
  avatar_url: string;
  login: string;
  html_url: string;
}

export class Users {
  heading: string = 'Github Users';
  users: Array<IUser> = [];
  http: HttpClient;

  constructor(@lazy(HttpClient) private getHttpClient: () => HttpClient) {}

  async activate(): Promise<void> {
    const http = this.http = this.getHttpClient();

    http.configure(config => {
      config
        .useStandardConfiguration()
        .withBaseUrl('https://api.github.com/');
    });

    const response = await http.fetch('users');
    this.users = await response.json();
  }
}
