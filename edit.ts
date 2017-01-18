/// <reference path="./ractive.d.ts"/>
/// <reference path="./KiiLib.d.ts"/>

// tsc edit.ts -out edit.js -target es2015

declare class JSONEditor {
    constructor(c : any, options : any);
    set(e : any);
}

class Page {
    r : Ractive;
    context : Kii.KiiContext;
    adminAPI : Kii.AdminAPI
    start() {      
        this.loadFromSession();
        var codeID = sessionStorage.getItem('codeID');
        this.adminAPI.downloadServerCode(codeID).then((code : string) => {
            this.r = new Ractive({
                el : '#container',
                template : '#template',
                data : {
                    code : code,
                },
            });
            this.r.on({
                submit : () => {
                    this.submit();
                },
            });
        });
    }

    private loadFromSession() {        
        var appID = sessionStorage.getItem('appID');
        var appKey = sessionStorage.getItem('appKey');
        var site = sessionStorage.getItem('site');
        var token = sessionStorage.getItem('token');
        this.context = new Kii.KiiContext(appID, appKey, site);
        this.context.setAccessToken(token);

        this.adminAPI = new Kii.KiiAdminAPI(this.context);
    }

    private submit() {
        var code = this.r.get('code');
        this.adminAPI.uploadServerCode(code).then((s : string) => {
            window.history.back();
        });
    }
}

new Page().start();