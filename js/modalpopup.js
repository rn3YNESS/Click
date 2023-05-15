
document.getElementById('aspnetForm').style.display="none";
//document.getElementById('SideNav').style.display="none";

window.addEventListener("load",function () {

// -----------------------------------------------
//  NEW CODE
// -----------------------------------------------

    //  Links should be in format: 
    //  
    //  Sharepoint List Forms:
    //  
    //  http(s)://url.of.thispage/?form=https://address.of.form/path/formname.aspx&page=<Form page to isplay>&itemid=<itemID>&callback=https://address.of.callback/path/page.aspx&width=<widthinpx>&height=<heightinpx>
    //  
    //  InfoPath Forms Library:
    //  
    //  NEW Item:
    //  http(s)://url.of.thispage/?form=https://address.of/FormServer.aspx&XsnLocation=/path/to/template.xsn&SaveLocation=/path/to/formsLibrary&callback=https://address.of.callback/path/page.aspx&width=<widthinpx>&height=<heightinpx>
    //  
    //  EDIT/VIEW Item:
    //  http(s)://url.of.thispage/?form=https://address.of/FormServer.aspx&XslLocation=/path/to/formname.xsl&callback=https://address.of.callback/path/page.aspx&width=<widthinpx>&height=<heightinpx>
    //
    //
    //  SharePoint List Forms:
    //  ----------------------
    //
    //  form         = https://address.of.form/path/formname.aspx
    //  defaultview  = <specify Infopah form page to display>     (optional)
    //  itemid       = <itemID>                                   (optional)
    //
    //  InfoPath Library Forms: (must have EITHER (BOTH XsnLocation AND SaveLocation) OR XsnLocation)
    //  -----------------------
    //
    //  form         = http://address.of/FormServer.aspx
    //
    //  NEW:
    //  XsnLocation  = relative path of form template (.xsn)
    //  SaveLocation = relative path of form library
    //
    //  EDIT/VIEW:
    //  XsnLocation  = relative path of form data (.xml)
    //
    //
    //  Common:
    //  -------
    //  source or
    //  callback     = https://address.of.callback/path/page.aspx (optional - defaults to root of form page, cannot contain arguments)
    //  width        = <widthinpx>                                (optional, default 730 pixels)
    //  height       = <heightinpx>                               (optional)
    //
    
    var htmlstart = '<html><head></head><body dir=rtl style="padding-top:200px;text-align:center;font-family:Tahoma;font-weight:bold;color:#365e7e"><img src="/images/IT_NEW%20LOGO_250PX.png" style="padding-left:100px"/><img src="/_catalogs/masterpage/Click/images/ClickLogo274x127.png"/><br/><br/>'
    var htmlend = '</body></html>'
    var defaultwidth = 730

    if(window.location.href.indexOf('?&http')>-1) {    //original code

        // ---Unused variables from old code---
        // var url=window.location.href;
        // var param=url.split("&");
        // var targetUrl=param[1];
        
        var defaultcallbackurl = "http://pmoportal/"

        if(window.location.href.split("&")[1].indexOf('pmoclick')>-1){
            if( window.location.href.split("&")[2]!=null && window.location.href.split("&")[2].indexOf('Cyber')>-1){
                var popupURL=window.location.href.split("&")[1]+ "?isCyber=1";
                javascript:OpenPopUpPage(popupURL,function() {window.location.href = defaultcallbackurl});
            }else{

                javascript:OpenPopUpPage(window.location.href.split("&")[1],function() {window.location.href = defaultcallbackurl},730);
            }
    
        } else {
            alert('!!!פנייה לא מורשית');
        }

    } else if(/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {  //new code: modern browsers only

        //TEST BROWSER

        var backurl = document.referrer;
        var browsermessage = htmlstart + 'דפדפן זה (Internet Explorer) אינו נתמך.<br/>הדף ייפתח ב-Microsoft Edge.<br/><br/>מומלץ לשנות את דפדפן ברירת המחדל שלך ל-Microsoft Edge, ולאפשר ל-Internet Explorer לפתוח דפים באופן אוטומטי.<br/><br/><img src="/images/allowpop.png"/>' + htmlend
        document.write(browsermessage);
        
        var referralURL = "microsoft-edge:" + window.location.href
        //referralURL.includes
        if ( !(referralURL.indexOf("callback")>-1) && !(referralURL.indexOf("source")>-1)) {
            referralURL = referralURL + "&callback=" + backurl;
            //alert(backurl);
        }

        window.open(referralURL);
    
    } else {  //new code: with paramerters

        var queryString = window.location.search;
        var params = new URLSearchParams(queryString);

        if(params.has("form")){
    
            var targeturl = new URL(params.get("form"),window.location.origin);

            var callbackurl =  new URL(window.location.origin,window.location.origin);  //default callback

            if( document.referrer != "" ) { callbackurl =  document.referrer };
            if( params.has("callback") ) { callbackurl = params.get("callback") };
            if( params.has("source") ) { callbackurl = params.get("source") };


            var _options = SP.UI.$create_DialogOptions();

            

            _options.dialogReturnValueCallback = function(result){
                window.open(callbackurl,"_self");
            }

            _options.allowMaximize = false;
            _options.showClose = true;
            _options.autoSize = true;

            if(params.has("width")) {
                _options.width = parseInt(params.get("width"));

            } else {
                _options.width = defaultwidth;
            }
            if(params.has("height")) {
                _options.height = parseInt(params.get("height"));

            }


            


            if ( (params.get("form")).indexOf("FormServer.aspx") > -1 ){ //for InfoPath Forms Library

                if( params.has("XsnLocation") ){ targeturl.searchParams.append("XsnLocation",params.get("XsnLocation")) };
                if( params.has("XmlLocation") ){ targeturl.searchParams.append("XmlLocation",params.get("XmlLocation")) };
                if( params.has("SaveLocation") ){ targeturl.searchParams.append("SaveLocation",params.get("SaveLocation")) };
                targeturl.searchParams.append("OpenIn","Browser")
                if( params.has("defaultview") ){ targeturl.searchParams.append("View",params.get("defaultview")) };
                if( params.has("iscyber") ){ targeturl.searchParams.append("isCyber",parseInt(params.get("iscyber"))) };
                //targeturl.searchParams.append("IsDlg",1)

                //var _options = SP.UI.$create_DialogOptions();
                _options.url = targeturl.href;
                    //_options.dialogReturnValueCallback = function(result){
                    //    window.open(callbackurl,"_self");
                    //}
                    //_options.allowMaximize = false;
                    //_options.showClose = true;
                    //_options.autoSize = true;
//
                    //if(params.has("width")) {
                    //    _options.width = parseInt(params.get("width"));
    //
                    //} else {
                    //    _options.width = defaultwidth;
                    //}
                    //if(params.has("height")) {
                    //    _options.height = parseInt(params.get("height"));
    //
                    //}

                    if( (targeturl.href.split("?")[0].indexOf('pmoclick')>-1) && ( ((params.has("XsnLocation")) && params.has("SaveLocation")) || (params.has("XmlLocation"))  )   ) {
                        //document.write(_options.url);
                        SP.UI.ModalDialog.showModalDialog(_options);
                    } else {
                        alert('!!!פנייה לא מורשית');
                    }


            } else { //SharePoint List Form

                if( params.has("itemid") ){ targeturl.searchParams.append("ID",parseInt(params.get("itemid"))) };
                if( params.has("defaultview") ){ targeturl.searchParams.append("DefaultView",params.get("defaultview")) };

                if( params.has("iscyber") ){ targeturl.searchParams.append("isCyber",parseInt(params.get("iscyber"))) };
                targeturl.searchParams.append("IsDlg",1)
                
                //var _options = SP.UI.$create_DialogOptions();
                _options.url = targeturl.href;
                //    _options.dialogReturnValueCallback = function(result){
                //        window.open(callbackurl,"_self");
                //    }
                //    _options.allowMaximize = false;
                //    _options.showClose = true;
                //    _options.autoSize = true;
//
                //if(params.has("width")) {
                //    _options.width = parseInt(params.get("width"));
//
                //} else {
                //    _options.width = defaultwidth;
                //}
                //if(params.has("height")) {
                //    _options.height = parseInt(params.get("height"));
//
                //}

                if(targeturl.href.split("?")[0].indexOf('pmoclick')>-1) {
                    //document.write(_options.url);
                    SP.UI.ModalDialog.showModalDialog(_options);
                } else {
                    alert('!!!פנייה לא מורשית');
                }
        }
        } else {

            document.write(htmlstart + "<div dir=ltr style='font-weight:normal'>Parameter <STRONG>'form'</STRONG> missing.<br/>Address not specified.</div>" + htmlend);

        }
    }

});