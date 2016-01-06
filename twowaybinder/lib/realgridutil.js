var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

/* div tag를 flash object tag로 대체 */

function setupGrid(tagid, width, height, onload, params) {
    var flashvars = {
        id: tagid
    };

    if (params) {
        for (var p in params) {
            flashvars[p] = params[p];
        }
    }

    if (onload) {
        flashvars.onload = typeof (onload) === "function" ? onload.name : onload;
        console && console.log(flashvars);
    }

    var pars = {
        quality: "high",
        wmode: "opaque",
        allowscriptaccess: "sameDomain",
        allowfullscreen: false,
        seamlesstabbing: false
    };


    if (isFirefox)
        pars.wmode = "direct";

    var attrs = {
        id: tagid,
        name: tagid,
        align: "middle"
    };

    /* SWFObject v2.2 <http://code.google.com/p/swfobject/> */
	var swfUrl = "lib/objects/RealGridWeb.swf";
	if (location.href.indexOf("http://localhost") == 0) {
		swfUrl = swfUrl + "?" + new Date().getTime();
	}
	swfobject.embedSWF(swfUrl, tagid, width, height, "11.1.0",	"lib/objects/expressInstall.swf", flashvars, pars, attrs);
};

function setupTree(tagid, width, height, onload, params) {
    var flashvars = {
        id: tagid
    };

    if (params) {
        for (var p in params) {
            flashvars[p] = params[p];
        }
    }

    if (onload) {
        flashvars.onload = typeof (onload) === "function" ? onload.name : onload;
        console && console.log(flashvars);
    }

    var pars = {
        quality: "high",
        wmode: "opaque",
        allowscriptaccess: "sameDomain",
        allowfullscreen: true,
        seamlesstabbing: false
    };

    if (isFirefox)
        pars.wmode = "direct";

    var attrs = {
        id: tagid,
        name: tagid,
        align: "middle"
    };

    /* used SWFObject v2.2 <http://code.google.com/p/swfobject/> */
	var swfUrl = "lib/objects/TreeGridWeb.swf";
	swfobject.embedSWF(swfUrl, tagid, width, height, "11.1.0", "lib/objects/expressInstall.swf", flashvars, pars, attrs);
};

/* grid 관련 utility */

function columnNameToIndex(grid, name) {
    var ret = -1;
    $.each(grid.getColumnNames(), function (index, value) {
        if (value == name)
            ret = index;
    });
    return ret;
}

function columnIndexToName(grid, index) {
    var columns = grid.getColumnNames();

    if (index < 0 || index > columns.length - 1)
        return null;

    return columns[index];
}

/* provider 관련 utility */
function fieldNameToIndex(provider, name) {
    var ret = -1;
    name = name.toUpperCase();
    $.each(provider.getFieldNames(), function (index, value) {
        if (value == name)
            ret = index;
    });
    return ret;
}

function fieldIndexToName(provider, index) {
    var fields = provider.getFieldNames();

    if (index < 0 || index > fields.length - 1)
        return null;

    return fields[index];
}

