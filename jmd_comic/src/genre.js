load('config.js');

function execute() {
    return Response.success([
        {
            title: "已完结", 
            input: BASE_URL + "/catalog/all/ob/hits/st/completed", 
            script: "gen.js"
        },
        {
            title: "更新中", 
            input: BASE_URL + "/catalog/all/ob/hits/st/serialized", 
            script: "gen.js"
        },
        {
            title: "韩漫", 
            input: BASE_URL + "/catalog/" + encodeURI("韩漫") + "/ob/hits/st/all", 
            script: "gen.js"
        },
        {
            title: "日漫", 
            input: BASE_URL + "/catalog/" + encodeURI("日漫") + "/ob/hits/st/all", 
            script: "gen.js"
        },
        {
            title: "3D漫画", 
            input: BASE_URL + "/catalog/" + encodeURI("3D漫画") + "/ob/hits/st/all", 
            script: "gen.js"
        },
        {
            title: "真人", 
            input: BASE_URL + "/catalog/" + encodeURI("真人") + "/ob/hits/st/all", 
            script: "gen.js"
        },
        {
            title: "短篇", 
            input: BASE_URL + "/catalog/" + encodeURI("短篇") + "/ob/hits/st/all", 
            script: "gen.js"
        }
    ]);
}