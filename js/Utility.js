var PMOClick = window.PMOClick || {};


PMOClick = {

    BrowserDetails: {
        IsIE: false,
        TrueVersion: 0,
        ActingVersion: 0,
        CompatibilityMode: false
    },

    User: {
        LogInName: null,
        ID: null,
        DisplayName: null,
        Email: null
    },

    GlobalVariables: {
        QuickLaunchNav: null,
        QuickLaunchSideNavContainers: [],
        QuickLaunchSideNavChildren: [],
        TopNavigationChildren: [],
        TopNavigationContainers: [],
        MyFavorites: null,
        SiteMap: [],
        NavId: null,
        SidebarLastOpen: "",
        Search: {
            CurrentPage: 1,
            RecordsPerPage: 5,
            ResultsArr: [],
            TempResultsArr: [],
            TotalResults: 0,
            Refiners: {
                SPItemType: {
                    Key: "סוג תוצאה",
                    Values: []
                }
            }
        },
        SPNotification: {
            StatusId: null,
            NotifyId: null
        }
    },

    CONSTANTS: {
        WEBAPPLICATIONURL: null,
        SITECONTEXT: null,
        SITEABSOLUTEURL: null,
        SITESERVERRELATIVEURL: null,
        WEBABSOLUTEURL: null,
        WEBSERVERRELATIVEURL: null,
        FORMMODE: null,
        CURRENTDATE: null,
        ROOTSITECONTEXT: null
    },

    Pages: {

    },

    Lists: {
        QuickLaunchNavigation: {
            EN: "QuickLaunchNavigation"
        },
        NavigationConfig: {
            EN: "NavigationConfig",
            HE: ""
        },
        MyFavorites: {
            HE: "מועדפים"
        }
    },

    // Create an instance of the current context.
    SharePointReady: function () {
        clientContext = SP.ClientContext.get_current();
        webSite = clientContext.get_web();
        site = clientContext.get_site();
        rootWeb = site.get_rootWeb();
        currentUser = webSite.get_currentUser();

        clientContext.load(webSite);
        clientContext.load(site);
        clientContext.load(rootWeb);
        clientContext.load(currentUser);
        clientContext.executeQueryAsync(PMOClick.onRequestSucceeded, PMOClick.onRequestFailed);
    },

    onRequestSucceeded: function () {
        PMOClick.CONSTANTS.WEBAPPLICATIONURL = window.location.protocol + "//" + window.location.host;
        PMOClick.CONSTANTS.SITESERVERRELATIVEURL = site.get_url();
        PMOClick.CONSTANTS.SITECONTEXT = webSite.get_url();
        PMOClick.CONSTANTS.WEBABSOLUTEURL = webSite.get_url();

        //User Info
        PMOClick.User.DisplayName = currentUser.get_title();
        PMOClick.User.LogInName = currentUser.get_loginName();
        PMOClick.User.Email = currentUser.get_email();
        PMOClick.User.ID = PMOClick.Methods.GetUserIdFromSiteUsers(PMOClick.User.LogInName);//currentUser.get_id();

        PMOClick.CONSTANTS.CURRENTDATE = PMOClick.Methods.FormatDateString(PMOClick.Methods.GetCurrentDate(), true);

        PMOClick.Init();
    },
    onRequestFailed: function (sender, args) {
        PMOClick.Methods.PopUpMessage(args.get_message());
    },

    Init: function () {
        //Check if this is modal dialog and hide navigation and footer
        if (document.location.href.indexOf("IsDlg=1") > -1) {
            $('.SideNav').css('display', 'none');
            $('.pmoFooter').css('display', 'none');
            $('.MainArea').css('padding-right', '10px');
            $('.ms-breadcrumb-box').css('display', 'none');
            $('#pageTitle').css('display', 'none');
            $('.pmoContent').css('height','100%');
        }
        if (document.location.href.indexOf("/Pages/") > -1 || document.location.href.indexOf("/pages/") > -1 ||document.location.href.indexOf("/SitePages/")>-1 ||document.location.href.indexOf("/sitepages/")>-1 ) {
            $('.ms-breadcrumb-box').css('display', 'none');
            $('#pageTitle').css('display', 'none');

        }
        PMOClick.GlobalVariables.MyFavorites = PMOClick.Methods.GetListItemsREST(PMOClick.CONSTANTS.WEBAPPLICATIONURL, PMOClick.Lists.MyFavorites.HE, null, "$filter=Author eq " + PMOClick.User.ID + " and FSObjType eq 0&$orderby=Created desc", null, null);
        //navigation always run
        PMOClick.GlobalVariables.QuickLaunchNav = PMOClick.Methods.GetListItemsREST(PMOClick.CONSTANTS.WEBAPPLICATIONURL, PMOClick.Lists.QuickLaunchNavigation.EN, "$select=NodeDescription,NavNodeIcon,Title,NodeNavIconHover,NodeOrder", null, null, "&$orderby=NodeOrder", null);
        var navigationNodes = PMOClick.Methods.SPRequest(false, PMOClick.CONSTANTS.WEBABSOLUTEURL + "/_api/web/navigation/quicklaunch?$expand=children", "GET", "application/json;", { accept: "application/json;odata=nometadata" }, null, null);
        $.each(navigationNodes.value, function (i, v) {
            if (v.Children.length > 0) {
                PMOClick.GlobalVariables.QuickLaunchSideNavChildren.push(v);
            }
            else {
                PMOClick.GlobalVariables.QuickLaunchSideNavContainers.push(v);
            }
        });
        var aa = PMOClick.Methods.SPRequest(false, PMOClick.CONSTANTS.WEBABSOLUTEURL + "/_api/web/navigation/TopNavigationbar?$expand=children", "GET", "application/json;", { accept: "application/json;odata=nometadata" }, null, null);
        $.each(aa.value, function (i, v) {
            if (v.Children.length > 0) {
                PMOClick.GlobalVariables.TopNavigationChildren.push(v);
            }
            else {
                PMOClick.GlobalVariables.TopNavigationContainers.push(v);
            }
        });
        //Init SiteMap

        /*!!!1sergey!!! (: 12/02/2023 cancelled because of internal site error in search engine :)*/
        /*var searchResults = PMOClick.Methods.RequestResultsFromSearchAPI("querytext='contentclass=STS_Site OR contentclass=STS_Web (path:" + PMOClick.CONSTANTS.WEBAPPLICATIONURL + ")'", "&rowlimit=500", "&selectproperties='Title,url,contentclass,ParentLink'", null, "&trimduplicates=false");
        if (searchResults.PrimaryQueryResult.RelevantResults.TotalRows > 0) {
            $.each(searchResults.PrimaryQueryResult.RelevantResults.Table.Rows, function (index, value) {
                if (value.Cells[4].Value == "STS_Site") {
                    var node = { IsParent: true, Title: value.Cells[2].Value, Url: value.Cells[3].Value, HasChildrens: true };
                    PMOClick.GlobalVariables.SiteMap.push(node);

                }
                else {
                    var node = { IsParent: false, Title: value.Cells[2].Value, Url: value.Cells[3].Value, HasChildrens: false, ParentLink: value.Cells[5].Value };
                    PMOClick.GlobalVariables.SiteMap.push(node);
                }

            });
        }*/

        //Home Page
        if (window.location.href.indexOf("pmoclick/Pages/default.aspx") > -1) {
            PMOClickHome.Init();
        }
        else {
            $('.pmoContent').css('overflow-x','auto');
        }
        //AddToFav
        if (window.location.href.indexOf("AddToFavorite.aspx") > -1) {
            PMOClickAddToFavorite.Init();
        }

        //DocsLink
        if (window.location.href.indexOf("DocsLink.aspx") > -1) {
            PMOClickDocsLink.Init();
        }

        if (window.location.href.indexOf("ClickManagment.aspx") > -1) {
            PMOClickMng.Init();
        }

        if (window.location.href.indexOf("visitorsIT/Pages/orderVisitors.aspx") > -1) {
            PMOClickOrdersIT.Init();
        }
        if (window.location.href.indexOf("visitors/Pages/orderVisitors.aspx") > -1) {
            PMOClick.Visitors.Init();
        }

        PMOClick.Load();
    },

    Load: function () {
        //$('#suiteBarTop').css('display','none');
        //Call To BuildNav Function
        PMOClick.Methods.DrawQuickLaunch(PMOClick.GlobalVariables.QuickLaunchNav);
        PMOClick.Methods.InitFavorites();
        //PMOClick.Methods.DrawQuickLaunchSide(PMOClick.GlobalVariables.QuickLaunchSideNav, PMOClick.GlobalVariables.        QuickLaunchSideNavChildren);
    },


    Methods: {

        HtmlHttpRequest: obj => {
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open(obj.method || "GET", obj.url);
                if (obj.headers) {
                    Object.keys(obj.headers).forEach(key => {
                        xhr.setRequestHeader(key, obj.headers[key]);
                    });
                }
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.response);
                    } else {
                        reject(xhr.statusText);
                    }
                };
                xhr.onerror = () => reject(xhr.statusText);
                xhr.send(obj.body);
            });
        },

        /*================= */
        /*  AutoComplete    */
        /*================= */
        Autocomplete: function (inp, arr) {
            /*the autocomplete function takes two arguments,
            the text field element and an array of possible autocompleted values:*/
            var currentFocus;
            /*execute a function when someone writes in the text field:*/
            inp.addEventListener("input", function (e) {
                var a, b, i, val = this.value;
                /*close any already open lists of autocompleted values*/
                closeAllLists();
                if (!val) { return false; }
                currentFocus = -1;
                /*create a DIV element that will contain the items (values):*/
                a = document.createElement("DIV");
                a.setAttribute("id", this.id + "autocomplete-list");
                a.setAttribute("class", "autocomplete-items");
                /*append the DIV element as a child of the autocomplete container:*/
                this.parentNode.appendChild(a);
                /*for each item in the array...*/
                for (i = 0; i < arr.length; i++) {
                    /*check if the item starts with the same letters as the text field value:*/
                    //if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    if (arr[i].toUpperCase().includes(val.toUpperCase())) {
                        /*create a DIV element for each matching element:*/
                        b = document.createElement("DIV");
                        /*make the matching letters bold:*/
                        b.innerHTML = arr[i].substr(0, arr[i].toUpperCase().indexOf(val.toUpperCase()));
                        b.innerHTML += "<strong>" + arr[i].substr(arr[i].toUpperCase().indexOf(val.toUpperCase()), val.length) + "</strong>";
                        b.innerHTML += arr[i].substr(arr[i].toUpperCase().indexOf(val.toUpperCase()) + val.length);
                        /*insert a input field that will hold the current array item's value:*/
                        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                        /*execute a function when someone clicks on the item value (DIV element):*/
                        b.addEventListener("click", function (e) {
                            /*insert the value for the autocomplete text field:*/
                            inp.value = this.getElementsByTagName("input")[0].value;
                            /*close the list of autocompleted values,
                            (or any other open lists of autocompleted values:*/
                            closeAllLists();
                        });
                        a.appendChild(b);
                    }
                }
            });
            /*execute a function presses a key on the keyboard:*/
            inp.addEventListener("keydown", function (e) {
                var x = document.getElementById(this.id + "autocomplete-list");
                if (x) x = x.getElementsByTagName("div");
                if (e.keyCode == 40) {
                    /*If the arrow DOWN key is pressed,
                    increase the currentFocus variable:*/
                    currentFocus++;
                    /*and and make the current item more visible:*/
                    addActive(x);
                } else if (e.keyCode == 38) { //up
                    /*If the arrow UP key is pressed,
                    decrease the currentFocus variable:*/
                    currentFocus--;
                    /*and and make the current item more visible:*/
                    addActive(x);
                } else if (e.keyCode == 13) {
                    /*If the ENTER key is pressed, prevent the form from being submitted,*/
                    e.preventDefault();
                    if (currentFocus > -1) {
                        /*and simulate a click on the "active" item:*/
                        if (x) x[currentFocus].click();
                    }
                }
            });
            function addActive(x) {
                /*a function to classify an item as "active":*/
                if (!x) return false;
                /*start by removing the "active" class on all items:*/
                removeActive(x);
                if (currentFocus >= x.length) currentFocus = 0;
                if (currentFocus < 0) currentFocus = (x.length - 1);
                /*add class "autocomplete-active":*/
                x[currentFocus].classList.add("autocomplete-active");
            }
            function removeActive(x) {
                /*a function to remove the "active" class from all autocomplete items:*/
                for (var i = 0; i < x.length; i++) {
                    x[i].classList.remove("autocomplete-active");
                }
            }
            function closeAllLists(elmnt) {
                /*close all autocomplete lists in the document,
                except the one passed as an argument:*/
                var x = document.getElementsByClassName("autocomplete-items");
                for (var i = 0; i < x.length; i++) {
                    if (elmnt != x[i] && elmnt != inp) {
                        x[i].parentNode.removeChild(x[i]);
                    }
                }
            }
            /*execute a function when someone clicks in the document:*/
            document.addEventListener("click", function (e) {
                closeAllLists(e.target);
            });
        },

        /*======================*/
        /*  General             */
        /*======================*/
        IsNullOrUndefined: function (obj) {
            /*if((obj == "") || (obj == null) || (obj == 'undefined')){
                return true;
            }
            return false;*/
            var v = null;

            return obj === v || typeof obj === 'undefined' || typeof obj === undefined;
        },

        isNullOrEmptyString: function (str) {
            var v = null;
            return str === v || typeof str === '' || str === '';
        },

        EncodeUrlForHtmlAttributes: function (a) {
            if (PMOClick.Methods.isNullOrEmptyString(a)) return "";
            var b = [new RegExp("&", "g"), new RegExp("<", "g"), new RegExp(">", "g"), new RegExp('"', "g"), new RegExp("'", "g")];
            a = a.replace(b[0], "&amp;");
            a = a.replace(b[1], "&lt;");
            a = a.replace(b[2], "&gt;");
            a = a.replace(b[3], "&quot;");
            return a.replace(b[4], "&#39;");
        },


        SPRequest: function (asyncP, urlP, typeP, contentTypeP, headersP, dataTypeP, dataP) {
            var obj;
            $.ajax({
                async: asyncP,
                url: urlP,
                type: typeP,
                contentType: contentTypeP,
                headers: headersP,
                dataType: dataTypeP,
                data: dataP,
                success: function (data, textStatus, jqXHR) {
                    obj = data;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("Text Status ; " + textStatus + " Error : " + errorThrown);
                }
            });
            return obj;
        },

        DrawQuickLaunch: function (quickLunachItems) {
            $.each(quickLunachItems.value, function (index, value) {
                //Nodes
                var node = "<div class='quickLaunchNode' Id='" + value.Title + "' onclick='PMOClick.Methods.ToggleQuickLaunchNode(\"" + value.Title + "\") ,PMOClick.Methods.SwitchImg(" + index + ")' title='" + value.NodeDescription + "'></div>";
                $('.QuickLaunchContainer').append(node);
                $('#' + value.Title).css({ "background-image": "url(" + value.NavNodeIcon.Url + ")", "background-repeat": "no-repeat", "background-position": "center" });
            });
          
        },

        InitFavorites: function () {
            if (PMOClick.GlobalVariables.MyFavorites.value.length > 0) {
                $.each(PMOClick.GlobalVariables.MyFavorites.value, function (i, v) {
                    PMOClick.Methods.DrawFavorite(v.Title, v.favoriteType, v.URL.Url, v.ID);
                });
            }
        },

        DrawFavorite: function (favDisplayName, favType, favUrl, Id) {
            switch (favType) {
                case "doc":
                    favType = "fileIcon.png";
                    break;
                case "page":
                    favType = "pageIcon.png";
                    break;
                case "form":
                    favType = "formsIcon.png";
                    break;
            }
            var preview = "<div class='col-lg-2 footerFav' id='" + Id + "' title='מועדפים'>" +
                "<div style='width:100%; display:inline-block;'>" +
                "<div class='h-50 pointer' style='text-align: center;'>" +
                "<img style='width:100px height:50px' onclick='PMOClick.Methods.OpenWindow(\"" + favUrl + "\")' alt='AddToFavorite' src='/_catalogs/masterpage/click/images/" + favType + "'/>" +
                "</div>" +
                "</div>" +
                "<div class='col-lg-12 pmoMyFavoriteText'>" +
                "<span>" + favDisplayName + "</span>" +
                "</div>" +
                "</div>";
            $(".myFavorite").append(preview);
        },

        OpenWindow: function (Url) {
            window.open(Url);
        },

        ToggleQuickLaunchNode: function (title) {
            $("#FavoritIcon").css("background-color", "rgb(53,94,126)");
            $("#NavIcon").css("background-color", "rgb(53,94,126)");
            $("#EmployeesFolders").css("background-color", "rgb(53,94,126)");
            $("#SearchIcon").css("background-color", "rgb(53,94,126)");
            if ($('.sidebar').css('width') != "0px" && PMOClick.GlobalVariables.SidebarLastOpen == title) {
                PMOClick.Methods.CloseNav(title);
            }
            else {
                PMOClick.Methods.OpenNav(title);
            }
            PMOClick.GlobalVariables.SidebarLastOpen = title;
        },

        DrawSiteMap: function (quickLaunchSideItems, quickLaunchSubSideItems) {
            var siteMapHtmlElement =
                "<ul id='myUL'>" +
                "<li id='siteMap'><div class='caret1'><span class='rightBorder1 textSiteMap'>&nbsp;&nbsp;&nbsp;<b>אתרים וסביבות עבודה</b></span></div><br>" +
                "<ul id='tree'>" +
                "</ul></li></ul>";
            $('#navBox').append(siteMapHtmlElement);
            if (quickLaunchSideItems.length > 0) {
                $.each(quickLaunchSideItems, function (index, value) {
                    if (value.ListTemplateType != 0 || value.Children.length > 0) {
                        var a, b;
                        if (value.Url.includes("//")) {
                            a = value.Url.split("//")[1].split("/");
                            b = a[a.length - 1];
                        }
                        else {
                            a = value.Url.split("/");
                            b = a[a.length - 1];
                        }
                        var nodeParent = "<li class='parentSiteNode' id='" + index + "' url='" + value.Url + "' title='" + value.Title + "'>" + value.Title + "</li>";
                        $('#tree').append(nodeParent);
                        var parentNode = $("[url='" + value.Url + "']");
                        $(parentNode).html("<div class='caret'><span class='rightBorder textSiteMap'>&nbsp;" + $(parentNode).attr('title') + "</span></div>");
                        $(parentNode).append("<ul id='ul_" + index + "' class='nested'></ul>");
                        var u = $('#ul_' + index);
                        if (u.length > 0) {
                            for (var i = 0; i < value.Children.length; i++) {
                                var childNode = "<li><a class='aTextSiteMap NotHaveChild' href='" + value.Children[i].Url + "'>" + value.Children[i].Title + "</a></li>";
                                $(u).append(childNode);
                            }
                        }
                    }
                });
            }
            if (quickLaunchSubSideItems.length > 0) {
                $.each(quickLaunchSubSideItems, function (index, value) {
                    if (value.ListTemplateType != 0) {
                        var a, b;
                        if (value.Url.includes("//")) {
                            a = value.Url.split("//")[1].split("/");
                            b = a[a.length - 1];
                        }
                        else {
                            a = value.Url.split("/");
                            b = a[a.length - 1];
                        }
                        var nodeParent = "<li class='parentSiteNode' id='" + index + "' url='" + value.Url + "' title='" + value.Title + "'>" + value.Title + "</li>";
                        $('#tree').append(nodeParent);
                        var parentNode = $("[url='" + value.Url + "']");
                        $(parentNode).html("<div class='caret'><span class='rightBorder textSiteMap'>&nbsp;" + $(parentNode).attr('title') + "</span></div>");
                        $(parentNode).append("<ul id='ul_" + index + "' class='nested'></ul>");
                        var childNode = "<li><a class='aTextSiteMap NotHaveChild' href='" + value.Url + "'>" + value.Title + "</a></li>";
                        $('#ul_' + index).append(childNode);
                        var u = $('#ul_' + index);
                        if (u.length > 0) {
                            for (var i = 0; i < value.Children.length; i++) {
                                var childNode = "<li><a class='aTextSiteMap NotHaveChild' href='" + value.Children[i].Url + "'>" + value.Children[i].Title + "</a></li>";
                                $(u).append(childNode);
                            }
                        }
                    }
                });
            }
            var list = document.getElementsByClassName("parentSiteNode");
            var i;

            for (i = 0; i < list.length; i++) {
                if ($($(list)[i]).children().length == 0) {
                    var parSite = $(list)[i];
                    var childNode = "&nbsp;&nbsp;&nbsp;<a class='aTextSiteMap ParentNotHaveChild' href='" + $(parSite).attr('url') + "'>&nbsp;&nbsp;" + $(parSite).attr('title') + "</a>";
                    $(parSite).html(childNode);
                }
            };
            //Init tree nodes toggling
            var toggler = document.getElementsByClassName("caret");
            var i;

            for (i = 0; i < toggler.length; i++) {
                toggler[i].addEventListener("click", function () {
                    this.parentElement.querySelector(".nested").classList.toggle("ulActive");
                    this.classList.toggle("caret-down");
                });
            }
        },

        OpenNav: function (title) {
            $("#navBox").empty();//Clear Container
            if (title == "FavoritIcon") {
                $("#mySidebar").css("width", "250px");
                $("#FavoritIcon").css("background-color", "#1C4B6B");
                // PMOClick.Methods.DrawQuickLaunchSide(PMOClick.GlobalVariables.TopNavigationChildren, PMOClick.GlobalVariables.TopNavigationContainers);
                // PMOClick.Methods.DrawSiteMap();
                PMOClick.Methods.DrawSiteMap(PMOClick.GlobalVariables.TopNavigationChildren, PMOClick.GlobalVariables.TopNavigationContainers)
            }
            if (title == "NavIcon") {
                $("#mySidebar").css("width", "96%");
                $("#NavIcon").css("background-color", "#1C4B6B");
                PMOClick.Methods.DrawSidebar("Services");
            }
            if (title == "EmployeesFolders") {
                $("#mySidebar").css("width", "250px");
                $("#EmployeesFolders").css("background-color", "#1C4B6B");
                //PMOClick.Methods.DrawSidebar("EmployeesFolders");
                PMOClick.Methods.DrawQuickLaunchSide(PMOClick.GlobalVariables.QuickLaunchSideNavChildren, PMOClick.GlobalVariables.QuickLaunchSideNavContainers);
                document.getElementById('navBox').innerHTML+="<BR><BR>";
            }
            if (title == "SearchIcon") {
                $("#mySidebar").css("width", "96%");
                $("#SearchIcon").css("background-color", "#1C4B6B");
                PMOClick.Methods.DrawSearch();
            }
        },

        /*  Search Area */
        DrawSearch: function () {
            PMOClick.Search.Methods.DrawSearch();
        },

        // DrawSiteMap: function () {
        //     $("#navBox").empty();//Clear Container
        //     var siteMapHtmlElement =
        //         "<ul id='myUL'>" +
        //         "<li id='siteMap'><div class='caret'><span class='rightBorder textSiteMap'>&nbsp;עץ אתרים</span></div>" +
        //         "<ul class='nested'>";
        //     //SiteCollection
        //     $.each(PMOClick.GlobalVariables.SiteMap, function (i, v) {
        //         if (v.IsParent) {
        //             var a = v.Url.split("//")[1].split("/");
        //             var b = a[a.length - 1];
        //             var parentNode = "<li class='parentSiteNode' id='" + b + "' url='" + v.Url + "' title='" + v.Title + "'>" + v.Title + "</li>";
        //             siteMapHtmlElement += parentNode;
        //         }
        //     });

        //     siteMapHtmlElement += "</ul></li></ul>";
        //     $('#navBox').append(siteMapHtmlElement);
        //     //SubSites
        //     $.each(PMOClick.GlobalVariables.SiteMap, function (i, v) {
        //         if (!v.IsParent) {
        //             var parentNode = $("[url='" + v.ParentLink + "']");
        //             var pId = $(parentNode).attr('id');
        //             var u = $('#ul_' + pId);
        //             if (u.length > 0) {
        //                 var childNode = "<li><a class='aTextSiteMap NotHaveChild' href='" + v.Url + "'>" + v.Title + "</a></li>";
        //                 $(u).append(childNode);
        //             }
        //             else {
        //                 $(parentNode).html("<div class='caret'><span class='rightBorder textSiteMap'>&nbsp;" + $(parentNode).attr('title') + "</span>");
        //                 $(parentNode).append("<ul id='ul_" + $(parentNode).attr('id') + "' class='nested'>");
        //                 var childNode = "<li><a class='aTextSiteMap NotHaveChild' href='" + v.Url + "'>" + v.Title + "</a></li>";
        //                 $('#ul_'+ $(parentNode).attr('id')).append(childNode);                        
        //             }
        //             $(parentNode).append("</ul>");
        //         }
        //     });
        //     var list = document.getElementsByClassName("parentSiteNode");
        //     var i;

        //     for (i = 0; i < list.length; i++) {
        //         if ($($(list)[i]).children().length == 0) {
        //             var parSite = $(list)[i];
        //             var childNode = "&nbsp;&nbsp;&nbsp;<a class='aTextSiteMap ParentNotHaveChild' href='" + $(parSite).attr('url') + "'>&nbsp;&nbsp;" + $(parSite).attr('title') + "</a>";
        //             $(parSite).html(childNode);
        //         }
        //     };
        //     //Init tree nodes toggling
        //     var toggler = document.getElementsByClassName("caret");
        //     var i;

        //     for (i = 0; i < toggler.length; i++) {
        //         toggler[i].addEventListener("click", function () {
        //             this.parentElement.querySelector(".nested").classList.toggle("ulActive");
        //             this.classList.toggle("caret-down");
        //         });
        //     }
        // },

        DrawSidebar: function (key) {
            var val = PMOClick.Methods.GetListItemsREST(PMOClick.CONSTANTS.WEBAPPLICATIONURL, PMOClick.Lists.NavigationConfig.EN, "$Select=*", "&$filter=Title eq '" + key + "'", null, null, null);
            $("#navBox").empty();//Clear Container
            $("#navBox").append(val.value[0].NavigationValue);
        },

        CloseNav: function (title) {
            $("#mySidebar").css("width", "0");
            $("#FavoritIcon").css("background-color", "rgb(53,94,126)");
            $("#NavIcon").css("background-color", "rgb(53,94,126)");
            $("#EmployeesFolders").css("background-color", "rgb(53,94,126)");
            $("#SearchIcon").css("background-color", "rgb(53,94,126)");
            if (title == undefined || title == "") {
                $.each(PMOClick.GlobalVariables.QuickLaunchNav.value, function (i, value) {
                    $('#' + value.Title).css({ "background-image": "url(" + value.NavNodeIcon.Url + ")", "background-repeat": "no-repeat", "background-position": "center" });
                })
            }
        },

        DrawQuickLaunchSide: function (quickLaunchSideItems, quickLaunchSubSideItems) {
            if (quickLaunchSideItems.length > 0) {
                $.each(quickLaunchSideItems, function (index, value) {
                    if (value.ListTemplateType != 0 || value.Children.length > 0) {
                        var node = "<dt class='sideNavText' id='" + value.Id + "'>&nbsp;" + value.Title + "</dt>";
                        for (var i = 0; i < value.Children.length; i++) {
                            node += "<dd class='sideSubNavText'> <a href='" + value.Children[i].Url + "'> &nbsp;" + value.Children[i].Title + "<a/></dd>";
                        }
                        $('#navBox').append(node);
                    }
                });
            }

            if (quickLaunchSubSideItems.length > 0) {
                $.each(quickLaunchSubSideItems, function (index, value) {
                    if (value.ListTemplateType != 0) {
                        var node = "<dt class='sideNavText' id='" + value.Id + "'>&nbsp;" + value.Title + "</dt>";
                        node += "</br>";
                        $('#navBox').append(node);
                    }
                });
            }
        },

        SwitchImg: function (index) {
            $.each(PMOClick.GlobalVariables.QuickLaunchNav.value, function (i, value) {
                if (index == i) {
                    if ($('#' + value.Title)[0].style.backgroundImage.includes(value.NavNodeIcon.Url))
                        $('#' + value.Title).css({ "background-image": "url(" + value.NodeNavIconHover.Url + ")", "background-repeat": "no-repeat", "background-position": "center" });
                    else if ($('#' + value.Title)[0].style.backgroundImage.includes(value.NodeNavIconHover.Url))
                        $('#' + value.Title).css({ "background-image": "url(" + value.NavNodeIcon.Url + ")", "background-repeat": "no-repeat", "background-position": "center" });
                }
                else
                    $('#' + value.Title).css({ "background-image": "url(" + value.NavNodeIcon.Url + ")", "background-repeat": "no-repeat", "background-position": "center" });
            })
        },

        checkId: function (quickLaunchSubSideItem) {
            return quickLaunchSubSideItem.mainSubjectId == PMOClick.GlobalVariables.NavId;
        },


        WebStorageSupport: function () {
            if (typeof (Storage) !== "undefined") {
                return true;
            } else {
                return false;
            }
        },

        SetToSessionStorage: function (key, value) {
            if (PMOClick.Methods.WebStorageSupport()) {
                sessionStorage.setItem(key, value);
            }
        },

        GetSessionStorage: function (key) {
            if (PMOClick.Methods.WebStorageSupport()) {
                return sessionStorage.getItem(key);
            }
        },


        //==========================================================================
        //==========================================================================
        //	 CRUD (Create, Read, Update, and Delete) operations by using REST API
        //==========================================================================
        //==========================================================================
        /*====================================================
                Working with list items by using REST
        =====================================================*/
        //The following example shows how to retrieve all of a list's items.
        RequestResultsFromSearchAPI: function (queryText, rowlimit, selectproperties, sortlist, trimduplicates) {
            var requestUri = PMOClick.CONSTANTS.WEBABSOLUTEURL + "/_api/search/query?";
            //queryText
            if (queryText != null || queryText != undefined)
                requestUri += queryText;
            //rowlimit    
            if (rowlimit != null || rowlimit != undefined)
                requestUri += rowlimit;
            //selectproperties    
            if (selectproperties != null || selectproperties != undefined)
                requestUri += selectproperties;
            //OrderBy
            if (sortlist != null || sortlist != undefined)
                requestUri += sortlist;
            //trimduplicates
            if (trimduplicates != null || trimduplicates != undefined)
                requestUri += trimduplicates;

            return PMOClick.Methods.SPRequest(false, requestUri, "GET", "application/json;", { accept: "application/json;odata=nometadata" }, null, null);
        },

        /*======================================
            Working with lists by using REST.
        =======================================*/

        //The following example shows how to create a list.
        CreateListREST: function (title, description) {
            var requestUri = PMOClick.CONSTANTS.WEBABSOLUTEURL + "/_api/web/lists";
            var d = JSON.stringify({ '__metadata': { 'type': 'SP.List' }, 'AllowContentTypes': true, 'BaseTemplate': 100, 'ContentTypesEnabled': true, 'Description': description, 'Title': title });
            var h = { 'X-RequestDigest': $("#__REQUESTDIGEST").val(), 'accept': 'application/json;odata=verbose', 'content-type': 'application/json;odata=verbose', 'content-length': d.length };
            return PMOClick.Methods.SPRequest(false, requestUri, "POST", "application/json;", h, null, d);
        },

        //The following example shows how to update a list.
        UpdateListREST: function (listGuid, title) {
            var requestUri = PMOClick.CONSTANTS.WEBABSOLUTEURL + "/_api/web/lists('" + listGuid + "')";
            var d = JSON.stringify({ '__metadata': { 'type': 'SP.List' }, 'Title': title });
            var h = { 'X-RequestDigest': $("#__REQUESTDIGEST").val(), 'IF-MATCH': '*', 'X-HTTP-Method': 'MERGE', 'accept': 'application/json;odata=verbose', 'content-type': 'application/json;odata=verbose', 'content-length': d.length };
            return PMOClick.Methods.SPRequest(false, requestUri, "POST", "application/json;", h, null, d);
        },

        //The following example shows how to create a custom field for a list.
        CreateFieldInListREST: function (listGuid, fieldTitle, fieldType, fieldRequired, fieldInternalName) {
            //Integer = 1,Text = 2,Note	= 3,DateTime = 4,Counter = 5,Choice = 6,Lookup = 7,Boolean = 8,Number = 9,Currency = 10,URL = 11,Computed = 12,Threading = 13,Guid = 14,MultiChoice = 15
            //GridChoice = 16,Calculated = 17,File = 18,Attachments = 19,User = 20
            var requestUri = PMOClick.CONSTANTS.WEBABSOLUTEURL + "/_api/web/lists('" + listGuid + "')/Fields";
            var d = JSON.stringify({ '__metadata': { 'type': 'SP.Field' }, 'Title': fieldTitle, 'FieldTypeKind': fieldType, 'Required': fieldRequired, 'EnforceUniqueValues': 'false', 'StaticName': fieldInternalName });
            var h = { 'X-RequestDigest': $("#__REQUESTDIGEST").val(), 'accept': 'application/json;odata=verbose', 'content-type': 'application/json;odata=verbose', 'content-length': d.length };
            return PMOClick.Methods.SPRequest(false, requestUri, "POST", "application/json;", h, null, d);
        },

        //The following example shows how to delete a list.
        DeleteListREST: function (listGuid) {
            var requestUri = PMOClick.CONSTANTS.WEBABSOLUTEURL + "/_api/web/lists('" + listGuid + "')";
            var h = { 'X-RequestDigest': $("#__REQUESTDIGEST").val(), 'IF-MATCH': '*', 'X-HTTP-Method': 'DELETE' };
            return PMOClick.Methods.SPRequest(false, requestUri, "POST", "application/json;", h, null, null);
        },

        //The following example shows how to get a list by guid.
        GetListByGuidREST: function (guid, requestUrl = null) {
            var requestUri = (PMOClick.Methods.isNullOrEmptyString(requestUrl)) ? PMOClick.CONSTANTS.WEBABSOLUTEURL : requestUrl;
            requestUri += "/_api/web/lists(guid'" + guid + "')";
            var lst = PMOClick.Methods.SPRequest(false, requestUri, "GET", "application/json;", { 'accept': "application/json;odata=nometadata" }, null, null);
            return lst;
        },

        //The following example shows how to get a list by title.
        GetListByTitleREST: function (list) {
            var requestUri = PMOClick.CONSTANTS.WEBABSOLUTEURL + "/_api/web/lists/GetByTitle('" + list + "')";
            var lst = PMOClick.Methods.SPRequest(false, requestUri, "GET", "application/json;", { 'accept': "application/json;odata=nometadata" }, null, null);
            return lst;
        },

        GetAllListsREST: function (list) {
            var requestUri = PMOClick.CONSTANTS.WEBABSOLUTEURL + "/_api/web/lists/";
            var lsts = PMOClick.Methods.SPRequest(false, requestUri, "GET", "application/json;", { 'accept': "application/json;odata=nometadata" }, null, null);
            return lsts;
        },

        /*====================================================
                Working with list items by using REST
        =====================================================*/
        //The following example shows how to retrieve all of a list's items.
        GetListItemsREST: function (requestUrl, list, selectedFields, filterByCommand, expand, orderBy, topItems) {
            var requestUri = (PMOClick.Methods.isNullOrEmptyString(requestUrl)) ? PMOClick.CONSTANTS.WEBABSOLUTEURL : requestUrl;
            //Select
            if (selectedFields != null || selectedFields != undefined)
                requestUri += "/_api/web/lists/GetByTitle('" + list + "')/items?" + selectedFields;
            else
                requestUri += "/_api/web/lists/GetByTitle('" + list + "')/items?";
            //FilterBy    
            if (filterByCommand != null || filterByCommand != undefined)
                requestUri += filterByCommand;
            //Expand    
            if (expand != null || expand != undefined)
                requestUri += expand;
            //OrderBy
            if (orderBy != null || orderBy != undefined)
                requestUri += orderBy;
            //Top
            if (topItems != null || topItems != undefined)
                requestUri += topItems;

            return PMOClick.Methods.SPRequest(false, requestUri, "GET", "application/json;", { accept: "application/json;odata=nometadata" }, null, null);
        },

        //The following example shows how to retrieve a specific list item.
        GetListItemREST: function (list, itemID) {
            var requestUri = PMOClick.CONSTANTS.WEBABSOLUTEURL + "/_api/web/lists/GetByTitle('" + list + "')/items(" + itemID + ")";
            var item = PMOClick.Methods.SPRequest(false, requestUri, "GET", "application/json;", { accept: "application/json;odata=nometadata" }, null, null);
            return item;
        },

        //The following example shows how to create a list item.
        CreateListItemREST: function (list, listEN, itemProperties) {
            var requestUri = PMOClick.CONSTANTS.WEBABSOLUTEURL + "/_api/web/lists/GetByTitle('" + list + "')/items";
            //Merge all field dynamicllay and add the '__metadata' key to the 'itemproperties' object
            var item = $.extend({ "__metadata": { "type": PMOClick.Methods.GetListItemType(listEN) } }, (typeof (itemProperties) == "string") ? JSON.parse(itemProperties) : itemProperties);
            var d = JSON.stringify(item);
            var h = { 'X-RequestDigest': $("#__REQUESTDIGEST").val(), 'accept': 'application/json;odata=verbose', 'content-type': 'application/json;odata=verbose', 'content-length': d.length };
            return PMOClick.Methods.SPRequest(false, requestUri, "POST", "application/json;", h, null, d);
        },

        //The following example shows how to update a list item.
        UpdateListItemREST: function (list, listEN, itemId, itemProperties, requestUrl = null) {
            var requestUri = (PMOClick.Methods.isNullOrEmptyString(requestUrl)) ? PMOClick.CONSTANTS.WEBABSOLUTEURL : requestUrl;
            requestUri += "/_api/web/lists/GetByTitle('" + list + "')/items(" + itemId + ")";
            //Merge all field dynamicllay and add the '__metadata' key to the 'itemproperties' object
            var item = $.extend({ "__metadata": { "type": PMOClick.Methods.GetListItemType(listEN) } }, (typeof (itemProperties) == "string") ? JSON.parse(itemProperties) : itemProperties);
            var d = JSON.stringify(item);
            var h = { 'X-RequestDigest': $("#__REQUESTDIGEST").val(), 'IF-MATCH': '*', 'X-HTTP-Method': 'MERGE', 'accept': 'application/json;odata=verbose', 'content-type': 'application/json;odata=verbose', 'content-length': d.length };
            return PMOClick.Methods.SPRequest(false, requestUri, "POST", "application/json;", h, null, d);
        },

        //The following example shows how to delete a list item.
        DeleteListItemREST: function (list, itemId) {
            var requestUri = PMOClick.CONSTANTS.WEBABSOLUTEURL + "/_api/web/lists/GetByTitle('" + list + "')/items(" + itemId + ")";
            var h = { 'X-RequestDigest': $("#__REQUESTDIGEST").val(), 'IF-MATCH': '*', 'X-HTTP-Method': 'DELETE', 'accept': 'application/json;odata=verbose', 'content-type': 'application/json;odata=verbose' };
            return PMOClick.Methods.SPRequest(false, requestUri, "POST", "application/json;", h, null, null);
        },

        // Getting the item type for the list
        GetListItemType: function (name) {
            return "SP.Data." + name[0].toUpperCase() + name.substring(1) + "ListItem";
        },

        /*====================================================
              Working with folders and files with REST
        =====================================================*/

        //The following example shows how to retrive a folder.
        GetFolderREST: function (list, folderName) {
            var requestUri = PMOClick.CONSTANTS.WEBABSOLUTEURL + "/_api/web/lists/GetByTitle('" + list + "')/items?$select=*,FileDirRef&$filter=(FSObjType eq 1 and Title eq '" + folderName + "')";
            var item = PMOClick.Methods.SPRequest(false, requestUri, "GET", "application/json;", { accept: "application/json;odata=nometadata" }, null, null);
            return item;
        },

        //The following example shows how to create a folder.
        CreateFolderREST: function (listHB, listEN, folderName) {
            var requestUri = PMOClick.CONSTANTS.WEBABSOLUTEURL + "/_api/web/lists/GetByTitle('" + listHB + "')/items";
            var item = $.extend({ "__metadata": { "type": PMOClick.Methods.GetListItemType(listEN) } }, { Title: folderName, FileLeafRef: folderName, FileSystemObjectType: SP.FileSystemObjectType.folder, ContentTypeId: "0x0120" });
            var d = JSON.stringify(item);
            var h = { 'X-RequestDigest': $("#__REQUESTDIGEST").val(), 'accept': 'application/json;odata=verbose', 'content-type': 'application/json;odata=verbose' };
            var createdFolder = PMOClick.Methods.SPRequest(false, requestUri, "POST", "application/json;", h, null, d);
            var renamedFolder = PMOClick.Methods.RenameFolder(listHB, createdFolder, folderName);
            return createdFolder.d;
        },

        RenameFolder: function (list, folder, folderName) {
            var requestUri = PMOClick.CONSTANTS.WEBABSOLUTEURL + "/_api/web/lists/GetByTitle('" + list + "')/items('" + folder.d.Id + "')";
            var d = JSON.stringify({ Title: folderName, FileLeafRef: folderName });
            var h = { Accept: "application/json;odata=nometadata", "Content-Type": "application/json;odata=nometadata", "X-RequestDigest": $("#__REQUESTDIGEST").val(), "IF-MATCH": "*", "X-Http-Method": "PATCH" };
            return PMOClick.Methods.SPRequest(false, requestUri, "POST", "application/json;", h, null, d);
        },

        GetItemsInFolder: function (list, folderName) {
            var requestUri = PMOClick.CONSTANTS.WEBABSOLUTEURL + "/_api/web/lists/GetByTitle('" + list + "')/getItems?$select=*,FileDirRef";
            var d = JSON.stringify({ query: { ViewXml: "", FolderServerRelativeUrl: PMOClick.CONSTANTS.WEBABSOLUTEURL + "/Lists/" + list + "/" + folderName } });
            var h = { 'X-RequestDigest': $("#__REQUESTDIGEST").val(), 'accept': 'application/json;odata=nometadata', 'content-type': 'application/json;odata=nometadata' };
            var items = PMOClick.Methods.SPRequest(false, requestUri, "POST", "application/json;", h, null, d);
            return items;
        },

        CreateItemInsideFolder: function (list, listEN, folderName, item) {
            var i = PMOClick.Methods.CreateListItemREST(list, listEN, item);
            var iFileDetails = PMOClick.Methods.GetItemFileDetails(null, list, i.d.Id);
            PMOClick.Methods.MoveItemToFolder(listEN, folderName, iFileDetails);
        },

        UpdateItemInsideFolder: function (list, folderName, itemID, metaData) {
            var requestUri = PMOClick.CONSTANTS.WEBABSOLUTEURL + "/_api/web/lists/GetByTitle('" + list + "')/items(" + itemID + ")";
            var item = $.extend({ "__metadata": { "type": PMOClick.Methods.GetListItemType(list) } }, metaData);
            var d = JSON.stringify(item);
            var h = { 'X-RequestDigest': $("#__REQUESTDIGEST").val(), 'accept': 'application/json;odata=verbose', 'content-type': 'application/json;odata=verbose', "IF-MATCH": "*", "X-Http-Method": "PATCH" };
            return PMOClick.Methods.SPRequest(false, requestUri, "POST", "application/json;", h, null, d);
        },

        GetItemFileDetails: function (requestUrl, list, item) {
            var requestUri = (PMOClick.Methods.isNullOrEmptyString(requestUrl)) ? PMOClick.CONSTANTS.WEBABSOLUTEURL : requestUrl;
            requestUri += "/_api/web/lists/GetByTitle('" + list + "')/items(" + item + ")?$select=*,FileLeafRef,FileRef,ServerUrl,FileDirRef";
            var h = { 'accept': 'application/json;odata=verbose' };
            return PMOClick.Methods.SPRequest(false, requestUri, "GET", "application/json;", h, null, null);
        },

        MoveItemToFolder: function (listEN, folderName, data) {
            var moveItemUrl = PMOClick.CONSTANTS.WEBABSOLUTEURL + "/_api/Web/getFileByServerRelativeURL('" + data.d.FileRef + "')/" + "moveto(newurl='/Lists/" + listEN + "/" + folderName + "/" + data.d.FileLeafRef.replace("_.000", "") + "',flags=1)";
            var h = { 'X-RequestDigest': $("#__REQUESTDIGEST").val(), 'accept': 'application/json;odata=verbose' };
            return PMOClick.Methods.SPRequest(false, moveItemUrl, "POST", "application/json;", h, null, null);
        },


        /*=================================================================================================================================================== 
         ====================================================================================================================================================
            The following sections describe tasks that you can complete programmatically and they include JavaScript code that demonstrate the operations.
            The following code performs these tasks to add a reference to the JavaScript object model:
            •Loads the SP.Runtime.js and SP.js files by using the getScript function in jQuery. 
             After loading the files, your program has access to the JavaScript object model for SharePoint.
            •Continues the flow in the execOperation function	
        ====================================================================================================================================================
         ==================================================================================================================================================*/

        /*============================
            webSite Options (JSOM)	
        ==============================*/

        /*============================
            Create list item (JSOM)	
        =============================*/
        CreateListItem: function (siteUrl, list, item) {
            var clientContext = new SP.ClientContext(siteUrl);
            var oList = clientContext.get_web().get_lists().getByTitle(list);
            var lookupValues = [];

            var itemCreateInfo = new SP.ListItemCreationInformation();
            var oListItem = oList.addItem(itemCreateInfo);

            for (i = 0; i < item.length; i++) {
                //if item's field is 'PeoplePicker' type,lookup type 
                if (item[i][0] == "ReqMng" || item[i][0] == "AllowedSendIT" || item[i][0] == "ProjectMgr") {
                    if (item[i][1].length != undefined) {
                        $.each(item[i][1], function (indrx, value) {
                            var us = new SP.FieldUserValue();
                            us.set_lookupId(value);
                            lookupValues.push(us);
                        });
                        oListItem.set_item(item[i][0], lookupValues);
                    }
                    else
                        oListItem.set_item(item[i][0], item[i][1]);
                }
                else
                    oListItem.set_item(item[i][0], item[i][1]);
            }
            oListItem.update();

            clientContext.load(oListItem);
            clientContext.executeQueryAsync(
                Function.createDelegate(this, PMOClick.Methods.OnCreateListItemSucceeded),
                Function.createDelegate(this, PMOClick.Methods.OnCreateListItemFailed)
            );
        },

        OnCreateListItemSucceeded: function () {
            alert("Item was created successfully");
        },

        OnCreateListItemFailed: function (sender, args) {
            alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
        },


        /*===========================
            Update list item (JSOM)	
        ============================*/
        UpdateListItem: function (siteUrl, list, itemID, item) {
            var clientContext = new SP.ClientContext(siteUrl);
            var oList = clientContext.get_web().get_lists().getByTitle(list);
            var lookupValues = [];

            var oListItem = oList.getItemById(itemID);
            for (i = 0; i < item.length; i++) {
                if (item[i][0] == "ReqMng" || item[i][0] == "AllowedSendIT" || item[i][0] == "ProjectMgr") {
                    if (item[i][1].length != undefined) {
                        $.each(item[i][1], function (indrx, value) {
                            var us = new SP.FieldUserValue();
                            us.set_lookupId(value);
                            lookupValues.push(us);
                        });
                        oListItem.set_item(item[i][0], lookupValues);
                    }
                    else
                        oListItem.set_item(item[i][0], item[i][1]);
                }
                else
                    oListItem.set_item(item[i][0], item[i][1]);
            }

            oListItem.update();
            //Set TimeOut
            window.setTimeout(oListItem.update(), 5000);

            clientContext.executeQueryAsync(
                Function.createDelegate(this, PMOClick.Methods.OnUpdateListItemSucceeded),
                Function.createDelegate(this, PMOClick.Methods.OnUpdateListItemFailed)
            );
        },

        OnUpdateListItemSucceeded: function (sender, args) {
            alert("Item was updated successfully");
        },

        OnUpdateListItemFailed: function (sender, args) {
            alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
        },

        /*===========================
            Delete list item (JSOM)	
        ============================*/
        DeleteListItem: function (siteUrl, list, itemID) {
            var itemId = itemID;
            var clientContext = new SP.ClientContext(siteUrl);
            var oList = clientContext.get_web().get_lists().getByTitle(list);
            var oListItem = oList.getItemById(itemId);
            oListItem.deleteObject();

            clientContext.executeQueryAsync(
                Function.createDelegate(this, PMOClick.Methods.OnDeleteListItemSucceeded),
                Function.createDelegate(this, PMOClick.Methods.OnDeleteListItemFailed)
            );
        },

        OnDeleteListItemSucceeded: function () {
            alert("Item was deleted successfully");
        },

        OnDeleteListItemFailed: function (sender, args) {
            alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
        },

        // query.PrimaryQueryResult.RelevantResults.Table.Rows.results
        SPRequestFiles: function (asyncP, urlP, typeP, contentTypeP, headersP) {
            var obj;

            $.ajax({
                async: asyncP,
                url: urlP,
                type: typeP,
                contentType: contentTypeP,
                headers: headersP,
                success: function (data, status) {
                    obj = data.d;
                },
                error: function (xData, status) {
                    return;
                }
            });

            return obj;
        },

        IeVersion: function () {
            //Set defaults
            var value = {
                IsIE: false,
                TrueVersion: 0,
                ActingVersion: 0,
                CompatibilityMode: false
            };

            //Try to find the Trident version number
            var trident = navigator.userAgent.match(/Trident\/(\d+)/);
            if (trident) {
                value.IsIE = PMOClick.BrowserDetails.IsIE = true;
                //Convert from the Trident version number to the IE version number
                value.TrueVersion = PMOClick.BrowserDetails.TrueVersion = parseInt(trident[1], 10) + 4;
                //alert("True Version "+value.TrueVersion);
            }

            //Try to find the MSIE number
            var msie = navigator.userAgent.match(/MSIE (\d+)/);
            if (msie) {
                value.IsIE = PMOClick.BrowserDetails.IsIE = true;
                //Find the IE version number from the user agent string
                value.ActingVersion = PMOClick.BrowserDetails.ActingVersion = parseInt(msie[1]);
                //alert("Acting Version "+value.ActingVersion );
            } else {
                //Must be IE 11 in "edge" mode
                value.ActingVersion = PMOClick.BrowserDetails.ActingVersion = value.TrueVersion;
                //alert("Acting Version "+value.ActingVersion );
            }

            //If we have both a Trident and MSIE version number, see if they're different
            if (value.IsIE && value.TrueVersion > 0 && value.ActingVersion > 0) {
                //In compatibility mode if the trident number doesn't match up with the MSIE number
                value.CompatibilityMode = PMOClick.BrowserDetails.CompatibilityMode = value.TrueVersion != value.ActingVersion;
                //alert("Compatibility Mode  "+value.CompatibilityMode );
            }
            return value;
        },

        /*===================================================*/
        /*                  URL Handaling                    */
        /*===================================================*/

        // Returns a URL Parameter
        GetURLParameter: function (name) {
            return decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]);
        },

        RemoveQueryStringFromUrl: function () {
            return window.location.href.split('?')[0];
        },

        //Insert Parameter To URL    
        setParameterToURL: function (paramName, paramValue, paramUrl) {
            if (paramUrl == "#") {
                paramUrl = _spPageContextInfo.webAbsoluteUrl;
            }

            var url = paramUrl;
            if (url.indexOf(paramName + "=") >= 0) {
                var prefix = url.substring(0, url.indexOf(paramName));
                var suffix = url.substring(url.indexOf(paramName));
                suffix = suffix.substring(suffix.indexOf("=") + 1);
                suffix = (suffix.indexOf("&") >= 0) ? suffix.substring(suffix.indexOf("&")) : "";
                url = prefix + paramName + "=" + paramValue + suffix;
            }
            else {
                if (url.indexOf("?") < 0) {
                    //console.log('Hello World');
                }
                else {
                    //console.log('Hello World');
                }

            }


            window.location.href = url;
        },

        /*===================================================*/
        /*                  Array Handaling                  */
        /*===================================================*/

        //Distinc Data from array and return distint array
        DistinctDataFromArray: function (array, distinctByValue) {
            var flags = [], output = [], l = array.length, i;
            for (i = 0; i < l; i++) {
                if (array[i][distinctByValue] == null) continue;
                if (flags[array[i][distinctByValue]]) continue;
                flags[array[i][distinctByValue]] = true;
                output.push({ ID: array[i].ID, Name: array[i][distinctByValue] });
            }

            return output;
        },

        //Distinc Data from array and return distint array
        DistinctObjFromArray: function (array, distinctByValue) {
            var flags = [], output = [], l = array.length, i;
            for (i = 0; i < l; i++) {
                if (flags[array[i][distinctByValue]]) continue;
                flags[array[i][distinctByValue]] = true;
                output.push(array[i]);
            }

            return output;
        },

        IsInArray: function (value, array, isMultiDimensional) {
            if (!isMultiDimensional) {
                return array.indexOf(value) > -1;
            }
            else {
                for (var i = 0; i < array.length; i++) {
                    if (array[i].indexOf(value) > -1) {
                        return true;
                    }
                }
                return false;
            }
        },

        GetItemPositionInArray: function (value, array, isMultiDimensional) {
            if (!isMultiDimensional) {
                return array.indexOf(value);
            }
            else {
                for (var i = 0; i < array.length; i++) {
                    if (array[i][0] == value) {
                        return i;
                    }
                }
                return null;
            }
        },

        FilterArrayByValue: function (arr, filterValue, key) {
            // (Note that because `price` and such are given as strings in your object,
            // the below relies on the fact that <= and >= with a string and number
            // will coerce the string to a number before comparing.)
            var newArray = arr.filter(function (el) {
                if (key == "FileType") {
                    if (!PMOClick.Methods.IsNullOrUndefined(el.FileType)) {
                        return el.FileExtension != null ? el.FileExtension.toLowerCase() == filterValue.toLowerCase() : el.FileType.toLowerCase() == filterValue.toLowerCase(); // Changed this so a home would match
                    }
                }
                else {
                    return el.contentclass.toLowerCase() == filterValue.toLowerCase(); // Changed this so a home would match
                }
            });

            return newArray;
        },



        /*===================================================*/
        /*                  Date Handaling                   */
        /*===================================================*/

        GetCurrentDate: function () {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();

            if (dd < 10) {
                dd = '0' + dd
            }

            if (mm < 10) {
                mm = '0' + mm
            }

            today = mm + '/' + dd + '/' + yyyy;

            return today;
        },

        ConvertDateToCustomDateAndTime: function (date) {
            var d = new Date(date);
            var dd = d.getDate();
            var mm = d.getMonth() + 1; //January is 0!
            var yyyy = (d.getFullYear());
            var hour = d.getHours();
            var minute = d.getMinutes();

            if (dd < 10) {
                dd = '0' + dd
            }

            if (mm < 10) {
                mm = '0' + mm
            }

            if (minute < 10) {
                minute = '0' + minute
            }

            if (hour < 10) {
                hour = '0' + hour
            }

            d = dd + '/' + mm + '/' + yyyy + " " + hour + ":" + minute;

            return d;
        },

        ConvertDateToCustomDate: function (date) {
            var d = new Date(date);
            var dd = d.getDate();
            var mm = d.getMonth() + 1; //January is 0!
            var yyyy = (d.getFullYear());

            if (dd < 10) {
                dd = '0' + dd
            }

            if (mm < 10) {
                mm = '0' + mm
            }

            d = dd + '/' + mm + '/' + yyyy;

            return d;
        },

        //Format date to "Month Day Year", Example : "January 25 2015"
        FormatDateString: function (date, withoutDay) {
            var formatDate = "";
            if (date == "Available anytime") {
                return "Available anytime";
            }
            if(date !== ""){
                var d = new Date(date);
                var monthNames = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
                if (!withoutDay) {
                    var day = d.getDate();
                    var monthIndex = d.getMonth();
                    var year = d.getFullYear();
                    //var formatDate = (monthNames[monthIndex] + ' ' + day + ' ' + year);
                    formatDate = (day + ' ' + monthNames[monthIndex] + ' ' + year);
                }
                else {
                    var monthIndex = d.getMonth();
                    var year = d.getFullYear();
                    formatDate = (monthNames[monthIndex] + ' ' + year);
                }
            }


            return formatDate;//d.toDateString();
        },

        GetYear: function (date) {
            var d = new Date(date);
            var yyyy = (d.getFullYear());

            return yyyy;
        },

        GetMonth: function (date) {
            var d = new Date(date);
            var mm = d.getMonth() + 1; //January is 0!

            if (mm < 10) {
                mm = '0' + mm
            }


            return mm;
        },

        GetMonthLiteral: function (month) {
            var monthNames = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
            var monthIndex = month;// + 1;
            var formatDate = (monthNames[monthIndex]);
            return formatDate;
        },

        /*===================================================*/
        /*                  Cookie Handaling                 */
        /*===================================================*/
        GetCookie: function (cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ')
                    c = c.substring(1);
                if (c.indexOf(name) == 0)
                    return c.substring(name.length, c.length);
            }

            return "";
        },

        GetUserLoginName: function (courseType) {
            var userid = courseType;
            var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/getuserbyid(" + userid + ")";
            var requestHeaders = { "accept": "application/json;odata=verbose" };
            var loginName = "";

            //Get User By ID
            $.ajax({
                url: requestUri,
                async: false,
                contentType: "application/json;odata=verbose",
                headers: requestHeaders,
                success: function (data, request) {
                    loginName = data.d.LoginName;
                    return loginName;
                },
                error: function () {
                    PMOClick.Methods.PopUpMessage("Error whike trying to Get User LoginName");
                }
            });

            return loginName;
        },

        GetUserIdFromSiteUsers: function (userLogIn) {
            var requestUri = PMOClick.CONSTANTS.WEBAPPLICATIONURL + "/_api/web/siteusers?$filter=LoginName eq '" + encodeURIComponent(userLogIn) + "'";
            var h = { 'accept': 'application/json;odata=verbose' };
            var d = PMOClick.Methods.SPRequest(false, requestUri, "GET", "application/json;", h, null, null);
            var userId = (d.d.results[0].Id == null) ? null : d.d.results[0].Id;
            return userId;
        },

        GetUserwithMail: function (users) {
            var user;
            $.each(users, function (i, v) {
                if (v.Email == PMOClick.User.Email) {
                    user = v;
                    return false;
                }
            });
            return user;
        },

        OpenInDialog: function (dlgTitle, dlgWidth, dlgHeight, dlgAllowMaximize, dlgShowClose, needCallbackFunction, pageUrl, xP, yP) {
            var options = {
                title: dlgTitle,
                url: pageUrl,
                width: dlgWidth,
                height: dlgHeight,
                allowMaximize: false,//dlgAllowMaximize,
                showClose: dlgShowClose,
                hiddenButtonValueBeforeDialog: true
            };

            if (needCallbackFunction) {
                options.dialogReturnValueCallback = Function.createDelegate(null, PMOClick.Methods.CloseDialog);
            }
            SP.SOD.execute('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', options);
            //var topY = screen.height/2;
            //$('.ms-dlgContent').offset({top:xP})
            //window.location.hash = 'classesZone';
            //$('.ms-dlgFrameContainer').focus();
            /*if ($(window).scrollTop() > 0)
        $('.ms-dlgContent').css('top', $(window).scrollTop() + ($(window).height() - $('.ms-dlgContent').height()) / 2 + "px");*/

        },

        CloseDialog: function (dialogResult, returnValue) {
            //if User PMOClick on OK Or Save
            if (dialogResult == SP.UI.DialogResult.OK) {
                SP.SOD.execute('sp.ui.dialog.js', 'SP.UI.ModalDialog.RefreshPage', SP.UI.DialogResult.OK);
            }
            else if (dialogResult == SP.UI.DialogResult.cancel) {
                SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel, null);
            }
            else {
                SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel, null);
            }

        },

        /*=======================================================
                SharePoint notification Status Bar to Client    
        ========================================================*/
        /*
            Important : if you use custom master page please add the below code to your html master page ; 
                <div id="notificationArea" class="ms-notif-box">
                </div>               
                <!--SPM:<SharePoint:AjaxDelta id="DeltaPageStatusBar" BlockElement="true" runat="server">-->
                <div id="pageStatusBar">
                </div>
                <!--ME:</SharePoint:AjaxDelta>-->
            Put it before the row :
            <!--CS: Start PlaceHolderMain Snippet-->
         
            Value   Priority
            -------------------
            red Very Important
            yellow  Important
            green   Success
            blue    Information         
        */
        AddNotification: function (strHTML, booleanSticky) {
            PMOClick.GlobalVariables.SPNotification.NotifyId = SP.UI.Notify.addNotification(strHTML, booleanSticky);
            PMOClick.GlobalVariables.SPNotification.NotifyId = SP.UI.Notify.showLoadingNotification(booleanSticky);
        },

        RemoveNotification: function () {
            SP.UI.Notify.removeNotification(PMOClick.GlobalVariables.SPNotification.NotifyId);
            PMOClick.GlobalVariables.SPNotification.NotifyId = '';
        },

        AddStatus: function (strTitle, strHtml, atBegining, color) {
            PMOClick.GlobalVariables.SPNotification.StatusId = SP.UI.Status.addStatus(strTitle, strHtml, atBegining);
            SP.UI.Status.setStatusPriColor(PMOClick.GlobalVariables.SPNotification.StatusId, color);
            //  setTimeout(() => { PMOClick.Methods.RemoveAllStatus(); }, 5000);
            setTimeout(function () { PMOClick.Methods.RemoveAllStatus(); }, 5000);
        },

        RemoveLastStatus: function () {
            SP.UI.Status.removeStatus(PMOClick.GlobalVariables.SPNotification.StatusId);
            PMOClick.GlobalVariables.SPNotification.StatusId = '';
        },

        RemoveAllStatus: function () {
            SP.UI.Status.removeAllStatus(true);
        },

        AppendStatus: function (strTitle, strHtml, atBegining, color) {
            SP.UI.Status.appendStatus(PMOClick.GlobalVariables.SPNotification.StatusId, strTitle, strHtml, atBegining);
            SP.UI.Status.setStatusPriColor(PMOClick.GlobalVariables.SPNotification.StatusId, color);
        },

        UpdateStatus: function (strHtml, color) {
            SP.UI.Status.updateStatus(PMOClick.GlobalVariables.SPNotification.StatusId, strHtml);
            SP.UI.Status.setStatusPriColor(PMOClick.GlobalVariables.SPNotification.StatusId, color);
        },
        PopUpMessage: function (text) {
            //alert(text);
            PMOClick.GlobalVariables.SPNotification.NotifyId = SP.UI.Notify.addNotification(text, false);

        }

    },
}
// Make sure the SharePoint script file 'sp.js' is loaded before your ExecuteOrDelayUntilScriptLoaded(PMOClick.SharePointReady, "sp.js");
SP.SOD.executeFunc('sp.js', 'SP.ClientContext', PMOClick.SharePointReady);