window.addEventListener("load",function () {

    if(/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
        
    document.getElementById('aspnetForm').style.display="none";
    document.getElementById('SideNav').style.display="none";
            var htmlstart = '<html><head></head><body dir=rtl style="padding-top:200px;text-align:center;font-family:Tahoma;font-weight:bold;color:#365e7e"><img src="/images/IT_NEW%20LOGO_250PX.png" style="padding-left:100px"/><img src="/_catalogs/masterpage/Click/images/ClickLogo274x127.png"/><br/><br/>'
            var htmlend = '</body></html>'
            //TEST BROWSER
            var browsermessage = htmlstart + 'דפדפן זה (Internet Explorer) אינו נתמך.<br/>הדף ייפתח ב-Microsoft Edge.<br/><br/>מומלץ לשנות את דפדפן ברירת המחדל שלך ל-Microsoft Edge, ולאפשר ל-Internet Explorer לפתוח דפים באופן אוטומטי.<br/><br/><img src="/images/allowpop.png"/>' + htmlend
            document.write(browsermessage);
            
            window.open("microsoft-edge:" + window.location.href);
        }
    });