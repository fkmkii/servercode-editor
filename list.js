/// <reference path="./ractive.d.ts"/>
/// <reference path="./KiiLib.d.ts"/>
// tsc list.ts -out list.js -target es2015
class Page {
    start() {
        this.loadFromSession();
        this.adminAPI.getServerCodeList().then((list) => {
            this.r = new Ractive({
                el: '#container',
                template: '#template',
                data: {
                    list: list,
                },
            });
            this.r.on({
                show: (e, code) => {
                    this.show(code);
                },
                setCurrent: (e, code) => {
                    this.setCurrent(code);
                },
                deleteCode: (e, code) => {
                    this.deleteCode(code);
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
    show(code) {
        sessionStorage.setItem('codeID', code.id);
        window.location.href = './edit.html';
    }
    setCurrent(code) {
        this.adminAPI.setCurrentServerCode(code.id).then((e) => {
            return this.adminAPI.getServerCodeList();
        }).then((list) => {
            this.r.set('list', list);
        }).catch((e) => {
            console.log(e);
        });
    }
    deleteCode(code) {
        if (!window.confirm('Would you delete?')) {
            return;
        }
        this.adminAPI.deleteServerCode(code.id).then((e) => {
            return this.adminAPI.getServerCodeList();
        }).then((list) => {
            this.r.set('list', list);
        }).catch((e) => {
            console.log(e);
        });
    }
}
new Page().start();
