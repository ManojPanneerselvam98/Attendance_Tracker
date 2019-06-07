import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { IConfig } from './config';

@Injectable()
export class Config {

    static settings: IConfig;

    constructor(private http: Http) { }

    load() {
        const jsonFile = `assets/config/config.json`;
        return new Promise<void>((resolve, reject) => {
            this.http.get(jsonFile).toPromise().then((response: Response) => {
                Config.settings = <IConfig>response.json();
                resolve();
            }).catch((response: any) => {
                reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
            });
        });
    }
}