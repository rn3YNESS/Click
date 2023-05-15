const navObject = {
    GlobalVariables: {
        currentNodeOpen: null,
        siteMap: {
            sites: []
        },
        ListsAndDocLibs: {
            lord: [],
            maxOrder: 0
        }
    },

    Lists: {
        QuickLaunchNavigation: {
            EN: "QuickLaunchNavigation"
        },
        NavigationConfig: {
            EN: "NavigationConfig",
            HE: ""
        },
        UsefulLinks: {
            EN: 'UsefulLinks',
            HE: "קישורים שימושיים"
        }
    }
}

const drawQuickLaunch = (quickLunachItems) => {
    for (const quickLaunchItem of quickLunachItems) {
        var node =
            `<div class='quickLaunchNode' Id='${quickLaunchItem.Title}' onclick='toggleQuickLaunchNode("${quickLaunchItem.Title}",this)' title='${quickLaunchItem.Title}'>
                <img alt="Asd" src="${quickLaunchItem.NavNodeIcon.Url}" />
            </div>`;
        document.getElementById("QuickLaunchContainer").innerHTML += node;
    }
}

const drawSearch = () => {
    let navBox = document.getElementById('navBox');
    navBox.innerHTML = "";
    var searchbox =
        `<!--HTML-->
        <div class='searchbox__container'>                       
            <input type='text' placeholder='חפש...' name='search' id='inptxtSearchBox' autocomplete='off' />
            <button id='searchButton' type='button' onclick='getSearchResults()''>
                <img style='width:25px; height:25px;' src='/_catalogs/masterpage/Click/public/images/SearchIcon.png' />
            </button>
        </div>
        <div class='searchresults__container flex__container'>
            <div id='searchResultsRef'>
            </div>
            <div id='searchResults__container'>
                <div id='searchResults'>
                </div>
                <div id='paginationPanel'>
                </div>
                <div id='totalSearchResultSum'> סה"כ תוצאות : <span id="resultsCount"></span>
                </div>
            </div>
        </div>`;

    navBox.innerHTML = searchbox;
    var input = document.getElementById("inptxtSearchBox");
    input.addEventListener("keypress", function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            getSearchResults();
        }
    });
}

//Render html from Config list by getting list item by Key
drawSidebar = async(key) => {
    const requestUri = buildRequestUrl(spContextObject.CONSTANTS.WEBAPPLICATIONURL,navObject.Lists.NavigationConfig.EN, "items", "$Select=*", `&$filter=Title eq '${key}'`, null, null, null);
    const val = await getData(requestUri);
    let navBox = document.getElementById('navBox');
    navBox.innerHTML = val.value[0].NavigationValue;
}

const toggler = (toggleElement) => {
    var toggler = document.getElementsByClassName(toggleElement);
    var j;

    for (j = 0; j < toggler.length; j++) {
        toggler[j].addEventListener("click", function() {
            this.querySelector(".nested").classList.toggle("ulActive");
            this.classList.toggle("caret-down");
        });
    }
}

const addEditLinks = () => {
    let mySidebarActions = document.getElementById('mySidebarActions');
    mySidebarActions.innerHTML += `<a href="javascript:void(0)" class="editLinks mySidebarActions__item" onclick="editLinks()">
    <img src="${_spPageContextInfo.webServerRelativeUrl}/_catalogs/masterpage/click/public/images/edit-24.png" alt="ערוך" width="16" height="16" /> ערוך קישורים
    </a>`;
}

const removeEditLinks = () => {
    if (!isNullOrEmpty(document.querySelector('.editLinks'))) {
        document.querySelector('.editLinks').remove();
    }
    cancelEditLinks();
}

const showSidebar = (elementId) => {
    let sidebar = document.getElementById('mySidebar');
    let navBox = document.getElementById('navBox');
    let sideNav = document.getElementById('SideNav');
    navBox.innerHTML = "" //Clear Container    
    if (document.getElementsByClassName("activeNode").length > 0) {
        document.getElementsByClassName("activeNode")[0].classList.remove("activeNode");
    }
    document.getElementById(elementId).classList.add("activeNode");
    sidebar.style.right = `${sideNav.offsetWidth}px`;
    switch (elementId) {
        case "FavoritIcon":
            //removeEditLinks();
            sidebar.style.width = "299px";
            drawSiteMap()
            break;
        case "EmployeesFolders":
            //Add edit links
            //addEditLinks();
            sidebar.style.width = "299px";
            drawListsAndLibreries(false);
            break;
        case "SearchIcon":
            removeEditLinks();
            sidebar.style.width = "96%";
            drawSearch();
            break;
        case "NavIcon":
            removeEditLinks();
            sidebar.style.width = "96%";
            drawSidebar("Services");
            break;
        default:
            break;
    }
}

const hideSidebar = (elementId) => {
    removeEditLinks();
    let sidebar = document.getElementById('mySidebar');
    let navBox = document.getElementById('navBox');
    sidebar.style.width = "";
    const nodesCollection = document.querySelectorAll('.quickLaunchNode'); //document.getElementById('QuickLaunchContainer').children;
    for (const node of nodesCollection) {
        node.classList.remove("activeNode");
        node.style.backgroundColor = "rgb(53,94,126)";
    }
}

const toggleQuickLaunchNode = (elementId, htmlElement) => {
    if (isNullOrEmpty(elementId)) {
        hideSidebar(elementId);
        switchImg(elementId);
    } else {
        let sidebar = document.getElementById('mySidebar');
        if (!isNullOrEmpty(sidebar.style.width) && navObject.GlobalVariables.currentNodeOpen == elementId) {
            hideSidebar(elementId);
            switchImg(elementId);
        } else {
            showSidebar(elementId);
            switchImg(elementId);
        }
        navObject.GlobalVariables.currentNodeOpen = elementId;
    }
}


const switchImg = (elementId) => {
    let a = document.querySelectorAll('.quickLaunchNode');
    let icons = [...a];
    const activeIcon = icons.filter(x => x.id === elementId); //Icon to activate
    //Get current active icon 
    const currentActiveIcon = icons.filter(x => x.children[0].src.includes("Hover"));
    if (currentActiveIcon.length > 0) {
        const currentActiveIconElement = document.getElementById(currentActiveIcon[0].id);
        //Remove active icon
        currentActiveIconElement.children[0].src = currentActiveIconElement.children[0].src.replace('Hover', '');
        if (currentActiveIconElement.id !== activeIcon[0].id) {
            //Add new active icon    
            activeIcon[0].children[0].src = activeIcon[0].children[0].src.replace(elementId, elementId + "Hover");
        }
    } else {
        //Add new active icon    
        activeIcon[0].children[0].src = activeIcon[0].children[0].src.replace(elementId, elementId + "Hover");
    }

}

const initQuickLaunch = async() => {
    const requestUri = buildRequestUrl(spContextObject.CONSTANTS.WEBAPPLICATIONURL,spContextObject.Lists.QuickLaunchNavigation.EN, "items", "$select=NodeDescription,NavNodeIcon,Title,NodeNavIconHover,NodeOrder", null, null, "&$orderby=NodeOrder", null);
    const quickLaunchItems = await getData(requestUri);
    drawQuickLaunch(quickLaunchItems.value);
}

const initNavigation = () => {
    console.log(`${new Date()} :init navigation`);
    initQuickLaunch();
}

initNavigation();