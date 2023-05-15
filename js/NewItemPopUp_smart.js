
document.getElementById('aspnetForm').style.display="none";
document.getElementById('SideNav').style.display="none";

window.addEventListener("load",function () {

// -----------------------------------------------
//  NEW CODE
// -----------------------------------------------

    //links should be in format: http://url.of.thispage/?form=https://address.of.form/path/formname.aspx&page=<Form page to display>&itemid=<itemID>&callback=https://address.of.callback/path/page.aspx&width=<widthinpx>&height=<heightinpx>
    //
    //  form        = https://address.of.form/path/formname.aspx
    //  defaultview = <specify Infopah form page to display>     (optional)
    //  itemid      = <itemID>                                   (optional)
    //  callback    = https://address.of.callback/path/page.aspx (optional - defaults to root of form page, cannot contain arguments)
    //  width       = <widthinpx>                                (optional, but recommended)
    //  height      = <heightinpx>                               (optional)
    //
    
    var htmlstart = '<html><head></head><body dir=rtl style="padding-top:200px;text-align:center;font-family:Tahoma;font-weight:bold;color:#365e7e"><img src="/images/IT_NEW%20LOGO_250PX.png" style="padding-left:100px"/><img src="/_catalogs/masterpage/Click/images/ClickLogo274x127.png"/><br/><br/>'
    var htmlend = '</body></html>'

    if(/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {

        //TEST BROWSER
        var browsermessage = htmlstart + 'דפדפן זה (Internet Explorer) אינו נתמך.<br/>הדף ייפתח ב-Microsoft Edge.<br/><br/>מומלץ לשנות את דפדפן ברירת המחדל שלך ל-Microsoft Edge, ולאפשר ל-Internet Explorer לפתוח דפים באופן אוטומטי.<br/><br/><img src="/images/allowpop.png"/>' + htmlend
        document.write(browsermessage);
        
        window.open("microsoft-edge:" + window.location.href);
    
    } else if(window.location.href.indexOf('?&http')>-1) {    //use old code

        //OLD CODE

        //---Unused variables from old code---
        //var url=window.location.href;
        //var param=url.split("&");
        //var targetUrl=param[1];
        
        var defaultcallbackurl = "http://pmoportal/"

        if(window.location.href.split("&")[1].indexOf('pmoclick')>-1){
            if( window.location.href.split("&")[2]!=null && window.location.href.split("&")[2].indexOf('Cyber')>-1){
                var popupURL=window.location.href.split("&")[1]+ "?isCyber=1";

                javascript:OpenPopUpPage(popupURL,function() {window.location.href = defaultcallbackurl});
            }else{

                //working
                javascript:OpenPopUpPage(window.location.href.split("&")[1],function() {window.location.href = defaultcallbackurl},730);
            }
    
        } else {
            alert('!!!פנייה לא מורשית');
        }

        
    } else {

        var queryString = window.location.search;
        var params = new URLSearchParams(queryString);


        //Modern Browser support (after we leave IE)
        //let params = (new URL(document.location)).searchParams;

        
        if(params.has("form")){
            var targeturl = new URL(params.get("form"))
            var callbackurl =  new URL(window.location.protocol + "//" + window.location.hostname)  //default callback

            if( params.has("callback") ) { callbackurl = params.get("callback") };
            if( params.has("itemid") ){ targeturl.searchParams.append("ID",parseInt(params.get("itemid"))) };
            if( params.has("defaultview") ){ targeturl.searchParams.append("DefaultView",params.get("defaultview")) };
            if( params.has("iscyber") ){ targeturl.searchParams.append("isCyber",parseInt(params.get("iscyber"))) };

            //var width = 750
            //var height = 800

            //if(params.has("width")) width = parseInt(params.get("width")) ;
            //if(params.has("height")) height = parseInt(params.get("height")) ;

            //SP.UI.ModalDialog.OpenPopUpPage(targeturl.href,
            //                                           callbackurl.href,
            //                                           width ,
            //                                           height );

            var _options = SP.UI.$create_DialogOptions();
                _options.url = targeturl.href;
                _options.dialogReturnValueCallback = function(result){
                    window.open(callbackurl,"_self");
                }
                _options.allowMaximize = false;
                _options.showClose = true;
                _options.autoSize = true;

            if(params.has("width")) {
                _options.width = parseInt(params.get("width"));
                //_options.autoSize = false;
            }
            if(params.has("height")) {
                _options.height = parseInt(params.get("height"));
                //_options.autoSize = false;
            }

            SP.UI.ModalDialog.showModalDialog(_options);


        } else {

            document.write(htmlstart + "Paramerter <STRONG>'form'</STRONG> missing.<br/>Address not specified." + htmlend);

        }
    }

});