export namespace main {
	
	export class updateInfo {
	    currentVersion: string;
	    latestVersion: string;
	    title: string;
	    notes: string;
	    url: string;
	    installerUrl?: string;
	
	    static createFrom(source: any = {}) {
	        return new updateInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.currentVersion = source["currentVersion"];
	        this.latestVersion = source["latestVersion"];
	        this.title = source["title"];
	        this.notes = source["notes"];
	        this.url = source["url"];
	        this.installerUrl = source["installerUrl"];
	    }
	}

}

