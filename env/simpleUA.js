function getUA() {
    var e = window.navigator.userAgent.toLowerCase();
    if (e.indexOf("msie") >= 0) {
        var t = e.match(/msie ([\d.]+)/)[1];
        return {
            type: "IE",
            version: t
        }
    }
    if (e.indexOf("trident") >= 0) return {
        type: "IE",
        version: "unknow"
    };
    if (e.indexOf("firefox") >= 0) {
        var t = e.match(/firefox\/([\d.]+)/)[1];
        return {
            type: "Firefox",
            version: t
        }
    }
    if (e.indexOf("chrome") >= 0) {
        var t = e.match(/chrome\/([\d.]+)/)[1];
        return {
            type: "Chrome",
            version: t
        }
    }
    if (e.indexOf("opera") >= 0) {
        var t = e.match(/opera.([\d.]+)/)[1];
        return {
            type: "Opera",
            version: t
        }
    }
    if (e.indexOf("Safari") >= 0) {
        var t = e.match(/version\/([\d.]+)/)[1];
        return {
            type: "Safari",
            version: t
        }
    }
    return {
        type: "unknow",
        version: "unknow"
    }
}