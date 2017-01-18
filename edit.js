/// <reference path="./ractive.d.ts"/>
/// <reference path="./KiiLib.d.ts"/>
class Page {
    start() {
        this.loadFromSession();
        var codeID = sessionStorage.getItem('codeID');
        this.adminAPI.downloadServerCode(codeID).then((code) => {
            this.r = new Ractive({
                el: '#container',
                template: '#template',
                data: {
                    code: code,
                },
            });
            this.r.on({
                submit: () => {
                    this.submit();
                },
            });
        });
    }
    loadFromSession() {
        var appID = sessionStorage.getItem('appID');
        var appKey = sessionStorage.getItem('appKey');
        var site = sessionStorage.getItem('site');
        var token = sessionStorage.getItem('token');
        this.context = new Kii.KiiContext(appID, appKey, site);
        this.context.setAccessToken(token);
        this.adminAPI = new Kii.KiiAdminAPI(this.context);
    }
    submit() {
        var code = this.r.get('code');
        this.adminAPI.uploadServerCode(code).then((s) => {
            window.history.back();
        });
    }
}
new Page().start();
