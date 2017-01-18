/// <reference path="./ractive.d.ts"/>
/// <reference path="./KiiLib.d.ts"/>

// tsc list.ts -out list.js -target es2015

class Page {
    r : Ractive;
    context : Kii.KiiContext;
    adminAPI : Kii.AdminAPI
    start() {      
        this.loadFromSession();
        this.adminAPI.getServerCodeList().then((list : Kii.KiiServerCode[]) => {
            this.r = new Ractive({
                el : '#container',
                template : '#template',
                data : {
                    list : list,
                },
            });
            this.r.on({
                show : (e : any, code : Kii.KiiServerCode) => {
                    this.show(code);
                },
                setCurrent : (e : any, code : Kii.KiiServerCode) => {
                    this.setCurrent(code);
                },
                deleteCode : (e : any, code : Kii.KiiServerCode) => {
                    this.deleteCode(code);
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

    private show(code : Kii.KiiServerCode) {
        sessionStorage.setItem('codeID', code.id);
        window.location.href = './edit.html';
    }

    private setCurrent(code : Kii.KiiServerCode) {
        this.adminAPI.setCurrentServerCode(code.id).then((e : any) => {
            return this.adminAPI.getServerCodeList();
        }).then((list : Kii.KiiServerCode[]) => {
            this.r.set('list', list);
        }).catch((e : any) => {
            console.log(e);
        });
    }

    private deleteCode(code : Kii.KiiServerCode) {
        if (!window.confirm('Would you delete?')) {
            return;
        }
        this.adminAPI.deleteServerCode(code.id).then((e : any) => {
            return this.adminAPI.getServerCodeList();
        }).then((list : Kii.KiiServerCode[]) => {
            this.r.set('list', list);            
        }).catch((e : any) => {
            console.log(e);
        });
    }
}

new Page().start();