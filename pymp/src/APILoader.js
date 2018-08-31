function APILoader(callback) {
    var api = {
        submitStat: function () {}
    };
    
    if (window.kongregateAPI) {
        kongregateAPI.loadAPI(function () {
            api.submitStat = kongregateAPI.getAPI().stats.submit();
            callback(api);
        });
        return;
    }
    
    callback(api);
}
