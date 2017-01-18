/// <reference path="./ractive.d.ts"/>
/// <reference path="./KiiLib.d.ts"/>
var sites = [];
sites.push({ label: 'en', url: 'https://api.kii.com/api' });
sites.push({ label: 'jp', url: 'https://api-jp.kii.com/api' });
class Page {
    start() {
        var apps = this.loadApps();
        this.r = new Ractive({
            el: '#container',
            template: '#template',
            data: {
                apps: apps,
                sites: sites,
                appID: '',
                appKey: '',
                site: sites[0],
            },
        });
        this.r.on({
            start: () => {
                this.login();
            },
            add: () => {
                this.addApp();
            }
        });
    }
    loadApps() {
        try {
            var apps = JSON.parse(localStorage.getItem('apps'));
            if (apps == null) {
                return [];
            }
            else {
                return apps;
            }
        }
        catch (e) {
            return [];
        }
    }
    login() {
        var app = this.r.get('app');
        var context = new Kii.KiiContext(app.appID, app.appKey, app.site.url);
        var appAPI = new Kii.KiiAppAPI(context);
        // login
        appAPI.loginAsAdmin(app.clientID, app.clientSecret).then((u) => {
            this.saveToSession(app, context);
            window.location.href = './list.html';
        }).catch((e) => {
            console.log(e);
        });
    }
    saveToSession(app, context) {
        sessionStorage.setItem('appID', app.appID);
        sessionStorage.setItem('appKey', app.appKey);
        sessionStorage.setItem('site', app.site.url);
        sessionStorage.setItem('token', context.getAccessToken());
    }
    addApp() {
        var appID = this.r.get('appID');
        var appKey = this.r.get('appKey');
        var site = this.r.get('site');
        var clientID = this.r.get('clientID');
        var clientSecret = this.r.get('clientSecret');
        var apps = this.r.get('apps');
        apps.push({
            appID: appID,
            appKey: appKey,
            site: site,
            clientID: clientID,
            clientSecret: clientSecret,
        });
        this.r.set('apps', apps);
        localStorage.setItem('apps', JSON.stringify(apps));
    }
}
new Page().start();
