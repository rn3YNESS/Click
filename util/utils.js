/*=================================*/
/*  SharePoint Utilities Methods   */
/*=================================*/

const getCurrentUser = async() => {
    if (!isNullOrEmpty(_spPageContextInfo.siteAbsoluteUrl)) {
        const requestUri = `${_spPageContextInfo.siteAbsoluteUrl}/_api/web/currentuser`
        const item = await getData(requestUri);
        return item;
    } else {
        showNotification("Error", "שליפת פרטי משתמש", "הפעולה נכשלה, בצע רפרוש מחדש");
    }
    return null;
}

/*====================================================
    Working with list items by using REST (v)
=====================================================*/
const getListItem = async(list, itemId,url) => {
    const requestUri = buildRequestUrl(url,list, `items(${itemId})`, `$select=*,FileLeafRef,FileRef,ServerUrl,FileDirRef`, null, null, null, null);
    const item = await getData(requestUri);
    return item;
}

//The following example shows how to create a list item.
const createListItem = async(list, listEN, itemFields,url) => {
    let createdItem = null;
    const requestUri = buildRequestUrl(url,list, "items", null, null, null, null, null);
    const body = itemFields;
    body['__metadata'] = { "type": getListItemType(listEN) }
    if (url !== _spPageContextInfo.webAbsoluteUrl) {  //Update item in another site requires us get digesttoken for the site          
        const requestUriDigest = `${url}/_api/contextinfo`;
        const data = await postData(requestUriDigest, {}, "");
        var h = {
            'X-RequestDigest': data.FormDigestValue
        };
        createdItem = await postData(requestUri, body, h);
    }
    else {
        createdItem = await postData(requestUri, body);
    }     
    return createdItem;
}

//The following example shows how to update a list item.
const updateListItem = async(list, itemId, itemFields) => {
    const requestUri = buildRequestUrl(null,list, `items(${itemId})`, null, null, null, null, null);
    const body = itemFields;
    const updatedItem = await updateData(requestUri, body);
}

//The following example shows how to delete a list item.
const deleteListItem = async(list, itemId) => {
    const requestUri = buildRequestUrl(null,list, `items(${itemId})`, null, null, null, null, null);
    const deletedItem = await deleteData(requestUri);
}

// Render and initialize the client-side People Picker.
const initializePeoplePicker = (peoplePickerElementId) => {

    // Create a schema to store picker properties, and set the properties.
    var schema = {};
    schema['PrincipalAccountType'] = 'User,DL,SecGroup,SPGroup';
    schema['SearchPrincipalSource'] = 15;
    schema['ResolvePrincipalSource'] = 15;
    schema['AllowMultipleValues'] = true;
    schema['MaximumEntitySuggestions'] = 50;
    schema['Width'] = '95%';

    // Render and initialize the picker. 
    // Pass the ID of the DOM element that contains the picker, an array of initial
    // PickerEntity objects to set the picker value, and a schema that defines
    // picker properties.
    this.SPClientPeoplePicker_InitStandaloneControlWrapper(peoplePickerElementId, null, schema);
}

// Query the picker for user information.
const getUserInfo = async(_PeoplePickerOject) => {

    // Get the people picker object from the page.
    const peoplePicker = _PeoplePickerOject //this.SPClientPeoplePicker.SPClientPeoplePickerDict.peoplePickerDiv_TopSpan;
    let usersIds = [];
    // Get information about all users.
    const users = peoplePicker.GetAllUserInfo();
    for (const user of users) {
        // Get the first user's ID by using the login name.
        const a = await getUserId(user.Key);
        if (a.length > 0) {
            usersIds.push(a[0].Id);
        }
    }

    return usersIds;
}

const getUserDisplayName = async(_PeoplePickerOject) => {
    // Get the people picker object from the page.
    const peoplePicker = _PeoplePickerOject //this.SPClientPeoplePicker.SPClientPeoplePickerDict.peoplePickerDiv_TopSpan;
    let usersDisplayName = [];
    // Get information about all users.
    const users = peoplePicker.GetAllUserInfo();
    for (const user of users) {
        usersDisplayName.push(user.DisplayText);
    }

    return usersDisplayName;
}

// Get the user ID.
const getUserId = async(loginName) => {
    const requestUri = `${spContextObject.CONSTANTS.SITECONTEXT}/_api/web/siteusers?$filter=LoginName eq '${encodeURIComponent(loginName)}'`;
    const d = await getData(requestUri).then(data => {
        return data.value;
    }).catch(error => {
        showNotification(null, "שגיאה  : ", error);
        console.log(error);
    });
    return d;
}


/*====================================================*/
/*      Working with folders and files with REST      */
/*===================================================*/
//The following example shows how to retrive a folder.
const getFolder = async(list, folderName,url) => {
    const requestUri = buildRequestUrl(url,list, "items", `$select=*,FileDirRef`, `&$filter=(FSObjType eq 1 and Title eq '${folderName}')`, null, null, null);
    const d = await getData(requestUri).then(data => {
        return data.value;
    }).catch(error => {
        showNotification(null, "שגיאה בשליפת פניות : ", error);
        console.log(error);
    });
    return d
}

//The following example shows how to create a folder.
const createFolder = async(listHB, listEN, folderName,url) => {
    const requestUri = buildRequestUrl(url,listHB, "items", null, null, null, null, null);
    const body = {
        __metadata: { "type": getListItemType(listEN) },
        Title: folderName,
        FileLeafRef: folderName,
        FileSystemObjectType: SP.FileSystemObjectType.folder,
        ContentTypeId: "0x0120"
    };

    if (url !== _spPageContextInfo.webAbsoluteUrl) {  //Update item in another site requires us get digesttoken for the site          
        const requestUriDigest = `${url}/_api/contextinfo`;
        const data = await postData(requestUriDigest, {}, "");
        var h = {
            'X-RequestDigest': data.FormDigestValue
        };
        const createdFolder = await postData(requestUri, body,h);
        const renamedFolder = await renameFolder(listHB, listEN, createdFolder, folderName,url);
    }
    else {
        const createdFolder = await postData(requestUri, body);
        const renamedFolder = await renameFolder(listHB, listEN, createdFolder, folderName,url);
    }
    return createdFolder
}

const renameFolder = async(list, listEN, folder, folderName,url) => {
    const renamedFolder = null;
    const requestUri = buildRequestUrl(url,list, `items(${folder.Id})`, null, null, null, null, null);
    const body = {
        __metadata: { "type": getListItemType(listEN) },
        Title: folderName,
        FileLeafRef: folderName,
    };
    if (url !== _spPageContextInfo.webAbsoluteUrl) {  //Update item in another site requires us get digesttoken for the site          
        const requestUriDigest = `${url}/_api/contextinfo`;
        const data = await postData(requestUriDigest, {}, "");
        var h = {
            'If-Match': '*',
            'X-HTTP-Method': 'MERGE',
            'X-RequestDigest': data.FormDigestValue
        };
        renamedFolder = await updateData(requestUri, body,h);
    }
    else {
        renamedFolder = await updateData(requestUri, body);
    }          
    return renamedFolder
}

const getItemsInFolder = async(list, listEN, folderName) => {
    const requestUri = buildRequestUrl(null,list, "getItems", `$select=*,FileDirRef`, null, null, null, null);
    const body = {
        query: {
            ViewXml: "",
            FolderServerRelativeUrl: `${spContextObject.CONSTANTS.WEBSERVERRELATIVEURL}/Lists/${listEN}/${folderName}`
        }
    };

    const items = await postData(requestUri, body);
    return items.value;
}

const createItemInsideFolder = async(list, listEN, folderName, item,url) => {
    const itemToCreate = await createListItem(list, listEN, item,url);
    const itemFileDetails = await getListItem(list, itemToCreate.Id,url);
    const d = moveItemToFolder(listEN, folderName, itemFileDetails,url);
}

const updateItemInsideFolder = (list, folderName, itemID, metaData) => {
    var requestUri = spContextObject.CONSTANTS.SITECONTEXT + "/_api/web/lists/GetByTitle('" + list + "')/items(" + itemID + ")";
    var item = $.extend({ "__metadata": { "type": getListItemType(list) } }, metaData);
    var d = JSON.stringify(item);
    var h = { 'X-RequestDigest': document.getElementById('__REQUESTDIGEST').value, 'accept': 'application/json;odata=verbose', 'content-type': 'application/json;odata=verbose', "IF-MATCH": "*", "X-Http-Method": "PATCH" };
    return PMOClick.Methods.SPRequest(false, requestUri, "POST", "application/json;", h, null, d);
}

const getItemFileDetails = async(list, itemId) => {
    const requestUri = buildRequestUrl(null,list, `items(${itemId})`, `$select=*,FileLeafRef,FileRef,ServerUrl,FileDirRef`, null, null, null, null);
    const itemDetails = await getData(requestUri)
    return itemDetails
}

const moveItemToFolder = async(listEN, folderName, data,url) => {
    var moveItemUrl = `${url}/_api/Web/getFileByServerRelativeURL('${data.FileRef}')/moveto(newurl='//Lists/${listEN}/${folderName}/${data.FileLeafRef.replace("_.000", "")}',flags=1)`;
    if (url !== _spPageContextInfo.webAbsoluteUrl) {  //Update item in another site requires us get digesttoken for the site          
        const requestUriDigest = `${url}/_api/contextinfo`;
        const data = await postData(requestUriDigest, {}, "");
        var h = {
            'X-RequestDigest': data.FormDigestValue
        };
        postData(moveItemUrl, {},h);
    }
    else {
        postData(moveItemUrl, {});
    }    
}

/*======================*/
/*  Utilities Methods   */
/*======================*/

//Drag and Drop API
const allowDrop = (ev) => {
    ev.preventDefault();
}

const drag = (ev) => {
    ev.dataTransfer.setData("text", ev.target.id);
}

const drop = (ev) => {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}

const isNullOrEmpty = (value) => {
    return !value
}

const encodeUrlForHtmlAttributes = (a) => {
    if (isNullOrEmpty(a)) return "";
    var b = [new RegExp("&", "g"), new RegExp("<", "g"), new RegExp(">", "g"), new RegExp('"', "g"), new RegExp("'", "g")];
    a = a.replace(b[0], "&amp;");
    a = a.replace(b[1], "&lt;");
    a = a.replace(b[2], "&gt;");
    a = a.replace(b[3], "&quot;");
    return a.replace(b[4], "&#39;");
}

const openWindow = (url) => {
    window.open(url);
}

const openModalDialog = async(modalTitle, requestUri) => { //requestUri = The html view adress we want to load inside the modal
    //const response = await fetch(spContextObject.CONSTANTS.SITECONTEXT.concat(requestUri))
    const response = await fetch(spContextObject.CONSTANTS.WEBAPPLICATIONURL.concat(requestUri))
        .then(data => {
            return data.text()
        })
        .then(html => {
            document.querySelector('.modal__body').innerHTML = html
            displayModal(modalTitle);
            return true
        })
        .catch(error => {
            showNotification(null, "שגיאה  : ", error);
            console.log(error);
        });

    return response;
}

const displayModal = (title) => {
    const backdrop = document.querySelector('.backdrop');
    const modal = document.querySelector('.modal');
    /*const closebtn = document.querySelector('.btn__close');
    closebtn.addEventListener('click', closeModal);*/
    const modalTitle = document.querySelector('.modal__title');
    const modalActions = document.querySelector('.modal__actions');
    modalActions.style.display = 'none';
    modalTitle.textContent = title;
    backdrop.style.display = 'block';
    modal.style.display = 'block';
    dragElement(modal);
}

//Load html view to modal container
const loadForm = (modalTitle, requestUri) => {
    fetch(spContextObject.CONSTANTS.SITECONTEXT.concat(requestUri))
        .then(data => {
            return data.text()
        })
        .then(html => {
            document.querySelector('.modal__body').innerHTML = html
            displayModal(modalTitle);
            dragElement(document.querySelector(".modal"));

        })
        .catch(error => {
            showNotification(null, "שגיאה  : ", error);
            console.log(error);
        });
}

const closeModal = () => {
    const backdrop = document.querySelector('.backdrop');
    const modal = document.querySelector('.modal');
    backdrop.style.display = 'none';
    modal.style.display = 'none';
}

const loadRequestForm = (formType, reqType, requestId) => {
    if (requestId) {
        const reqUrl = buildRequestUrl(null,requestUtil.Lists.Requests.EN, 'items', null, `?$filter=ReqID eq '${requestId}'`, null, null, null);
        getData(reqUrl).then(data => {
            //Edit Form
            initFormData(formType, reqType, data.value[0]);
        }).catch(error => {
            showNotification(null, "שגיאה בפתיחת טופס : ", error);
            console.log(error);
        });
    } else {
        //New Form
        initFormData(formType, reqType);
    }
}

const initFormData = async(formType, reqType, request) => {
    //Only for Indipended form
    if (reqType === 0) {
        await getSPListItems(spContextObject.Lists.Subjects.EN, "ReqSubject"); //CR: 07-04-2022
        await getSPListItems(spContextObject.Lists.SubSubjects.EN, "ReqSubSubject"); //CR: 07-04-2022
        changeSubject(); //Change subSubjects regarding to selected subject
    }
    //Get Mokdanim
    await getSPListItems(spContextObject.Lists.Mokdanim.EN, "ReqMokdanName"); //CR: 07-04-2022
    //Get Sources
    await getSPListItems(spContextObject.Lists.Sources.EN, "ReqSource"); //CR: 07-04-2022


    (formType === "New") ? initNewForm(reqType): initEditForm(reqType, request);

    disableField([
        `ReqID`,
        'ReqCreationDate',
        `ReqFirstName`,
        `ReqUnit`,
        `ReqRank`,
        `ReqMatirialStatus`,
        `ReqIsMarried`,
        `ReqPhoneNumber`
    ]);
}

// Make the DIV element draggable:
const dragElement = (elmnt) => {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (document.querySelector(".modal__header")) {
        // if present, the header is where you move the DIV from:
        document.querySelector(".modal__header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

const updateSessionStorage = (key, value) => {
    const reqs = JSON.parse(sessionStorage.getItem(key));
    reqs.push(value);
    sessionStorage.setItem(key, JSON.stringify(reqs));
}

const toggleSpinner = () => {
    var element = document.querySelector(".loader");
    element.classList.toggle("loader");
}

const bindAlertButton = () => {
    // Get all elements with class="closebtn"
    const close = document.getElementsByClassName("closebtnalert");
    var i;

    for (i = 0; i < close.length; i++) {
        close[i].onclick = function() {
            hideNotification(this);
        }
    }
}

const getData = async function(url) {
    const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
        }).then(response => {
            return response.json()
        }) // parses JSON response into native JavaScript objects
        .then(responseData => {
            return responseData
        }).catch(error => {
            console.log(error);
        });
    return response;
}

const updateData = async(url = '', data = {},additionalHeaders) => {
    var h = {
        'If-Match': '*',
        'X-HTTP-Method': 'MERGE',
        ...additionalHeaders

    };
    const response = await postData(url, data, h);
    return response;
}
const deleteData = async(url = '') => {
    var h = {
        'IF-MATCH': '*',
        'X-HTTP-Method': 'DELETE',
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose'
    };
    const response = await postData(url, "", h);
    return response;
}

const postData = async function(url = '', data = {}, additionalHeaders) {
    const headers = {
            'Content-Type': 'application/json;odata=verbose',
            'X-RequestDigest': JSON.parse(sessionStorage.getItem("__REQUESTDIGEST")),
            'Accept': 'application/json',
            ...additionalHeaders
        }
        // Default options are marked with
    const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: headers,
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        }).then(response => {
            if (response.status !== 204) { //204 = No Content
                return response.json()
            } else {
                return response
            }

        }) // parses JSON response into native JavaScript objects
        .then(responseData => {
            return responseData
        }).catch(error => {
            console.log(error);
        });
    return response;
}

const showNotification = (status, alertPrefix, alertMessage) => {
    const alert = document.getElementById('mainAlert');
    const altPrefix = document.querySelector('.alert__prefix');
    const altMessage = document.querySelector('.alert__message');
    alert.style.opacity = "1";
    alert.classList.add(status);
    alert.style.display = 'block';
    altPrefix.textContent = alertPrefix;
    altMessage.textContent = alertMessage;
}

const hideNotification = (btn) => {
    // Get the parent of <span class="closebtn"> (<div class="alert">)
    let div = btn.parentElement;
    // Set the opacity of div to 0 (transparent)
    div.style.opacity = "0";
    // Hide the div after 600ms (the same amount of milliseconds it takes to fade out)
    setTimeout(function() { div.style.display = "none"; }, 600);
}

const buildRequestUrl = (webAppUrl,list, beforeQueryString, selectedFields, filterByCommand, expand, orderBy, topItems) => {
    let requestUri = webAppUrl;
    if(isNullOrEmpty(webAppUrl)){
        requestUri = (spContextObject.CONSTANTS.WEBABSOLUTEURL === null) ? _spPageContextInfo.webAbsoluteUrl : spContextObject.CONSTANTS.WEBABSOLUTEURL;
    }
    //Select
    if (selectedFields !== null && selectedFields !== undefined)
        requestUri += `/_api/web/lists/GetByTitle('${list}')/${beforeQueryString}?${selectedFields}`;
    else
        requestUri += `/_api/web/lists/GetByTitle('${list}')/${beforeQueryString}?`;
    //FilterBy    
    if (filterByCommand !== null && filterByCommand !== undefined)
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

    return requestUri;
}

const buildSearchQuery = (queryText, rowlimit, selectproperties, sortlist, trimduplicates) => {
    let requestUri = `${(spContextObject.CONSTANTS.WEBABSOLUTEURL === null) ? _spPageContextInfo.webAbsoluteUrl : spContextObject.CONSTANTS.WEBABSOLUTEURL}/_api/search/query?`;
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

    return requestUri;
}

const isEmpty = (obj) => {
    if ((obj == "") || (obj == null) || (obj == 'undefined')) {
        return true;
    }
    return false;
}

const isInArray = (value, array, isMultiDimensional) => {
    if (!isMultiDimensional) {
        return array.indexOf(value) > -1;
    } else {
        for (var i = 0; i < array.length; i++) {
            if (array[i].indexOf(value) > -1) {
                return true;
            }
        }
        return false;
    }
}

const removeChildesFromSelectElement = (htmlSelectElement) => {
    let i = htmlSelectElement.children.length - 1;
    while (htmlSelectElement.children.length > 0) {
        htmlSelectElement.children[i].remove();
        i--;
    }
}

const fillSelectElement = (htmlSelectElement, collection) => {
    if (htmlSelectElement !== null) {
        //Clear select childrens
        removeChildesFromSelectElement(htmlSelectElement);
        //Add options
        collection.forEach((val) => {
            //create new mark
            var node = document.createElement("option");
            var attValue = document.createAttribute("value");
            attValue.value = val.Title;
            var attId = document.createAttribute("id");
            attId.value = val.Id;
            node.setAttributeNode(attValue);
            node.setAttributeNode(attId);
            var txtNode = document.createTextNode(val.Title);
            node.appendChild(txtNode);
            htmlSelectElement.appendChild(node);
        })
    } else {
        console.log(`'Subject' HTML Element doesn't exist in this form type`)
    }
}

const getListItemType = (name) => {
    return "SP.Data." + name[0].toUpperCase() + name.substring(1) + "ListItem";
}

/*================= */
/*  AutoComplete    */
/*================= */
const autocomplete = (inp, arr) => {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
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
                b.addEventListener("click", function(e) {
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
    inp.addEventListener("keydown", function(e) {
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
    document.addEventListener("click", function(e) {
        closeAllLists(e.target);
    });
}

/*======================*/
/*   Date functions     */
/*======================*/
const getDate_d = (date) => {
    let d = new Date(date);
    var day = String(d.getDate()).padStart(2, '0');
    var month = d.getMonth() + 1;
    var year = d.getFullYear();

    var output = year + '-' + ((month < 10) ? '0' : '') + month + '-' + ((day < 10 && day.length < 2) ? '0' : '') + day;

    return output;
}

const getCurrentDate = () => {
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + d.getFullYear();

    return output;
}

const withoutTime = (dateTime) => {
    var date = new Date(dateTime.getTime());
    date.setHours(0, 0, 0, 0);
    return date;
}

const isToday = (someDate) => {
    const today = new Date()
    return someDate.getDate() == today.getDate() &&
        someDate.getMonth() == today.getMonth() &&
        someDate.getFullYear() == today.getFullYear()
}

//const format from dd/mm/yyyy to mm/dd/yyyy
const formatDate = (date) => {
    var dateArr = date.split('/');
    var day = dateArr[0];
    var month = dateArr[1];
    var year = dateArr[2];

    var output = month + '/' + day + '/' + year;

    return output;
}

//Format date to "Month Day Year", Example : "January 25 2015"
const formatDateString = (date, withoutDay) => {
    var formatDate = "";
    if (date == "Available anytime") {
        return "Available anytime";
    }
    if (date !== "") {
        var d = new Date(date);
        var monthNames = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
        if (!withoutDay) {
            var day = d.getDate();
            var monthIndex = d.getMonth();
            var year = d.getFullYear();
            //var formatDate = (monthNames[monthIndex] + ' ' + day + ' ' + year);
            formatDate = (day + ' ' + monthNames[monthIndex] + ' ' + year);
        } else {
            var monthIndex = d.getMonth();
            var year = d.getFullYear();
            formatDate = (monthNames[monthIndex] + ' ' + year);
        }
    }


    return formatDate; //d.toDateString();
}

const formatDateHE = (date) => {
    var monthNamesEN = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];
    var monthNamesHE = [
        "ינואר", "פברואר", "מרץ",
        "אפריל", "מאי", "יוני", "יולי",
        "אוגוסט", "ספטמבר", "אוקטובר",
        "נובמבר", "דצמבר"
    ];

    var date = new Date(date);
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return (day + ' ' + monthNamesHE[monthIndex] + ' ' + year);
}

const formatHEDateToDate = (date) => {
    var monthNamesHE = [
        "ינואר", "פברואר", "מרץ",
        "אפריל", "מאי", "יוני", "יולי",
        "אוגוסט", "ספטמבר", "אוקטובר",
        "נובמבר", "דצמבר"
    ];
    let a = date.split(" ");
    let dateToDate = new Date(`${monthNamesHE.indexOf(a[1])+1}/${a[0]}/${a[2]}`);
    return dateToDate;
}

//Get Date object and return time
const getDateTime = (dateTime) => {
    if (typeof(dateTime) == "string") {
        dateTime = new Date(dateTime);
    }
    return addZero(dateTime.getHours()) + ":" + addZero(dateTime.getMinutes()) + ":" + addZero(dateTime.getSeconds());
}

const convertTimeStampToDate = (timestamp) => {
    let num = new Number(timestamp);
    let date = new Date(num);
    return date;
}

const addZero = (i) => {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

const getMonthLiteral = (month) => {
    var monthNames = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
    var monthIndex = month; // + 1;
    var formatDate = (monthNames[monthIndex]);
    return formatDate;
}

/*====================*/
/*  Array functions   */
/*====================*/

const groupArrayBy = (arr, key) => {
    return arr.reduce((rv, x) => {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}

const filterArrayByValue = (arr, filterValue, key) => {
    // (Note that because `price` and such are given as strings in your object,
    // the below relies on the fact that <= and >= with a string and number
    // will coerce the string to a number before comparing.)
    var newArray = arr.filter(function(el) {
        if (key == "FileType") {
            if (!isNullOrEmpty(el.FileType)) {
                return el.FileExtension != null ? el.FileExtension.toLowerCase() == filterValue.toLowerCase() : el.FileType.toLowerCase() == filterValue.toLowerCase(); // Changed this so a home would match
            }
        } else {
            return el.contentclass.toLowerCase() == filterValue.toLowerCase(); // Changed this so a home would match
        }
    });

    return newArray;
}

/*======================*/
/*    DOM functions     */
/*======================*/
const appendHtmlElement = (appendToElement, elementToAppend, text) => {
    const node = document.createElement(elementToAppend); // Create a <li> node
    const textnode = document.createTextNode(text); // Create a text node
    node.appendChild(textnode);
    document.getElementById(appendToElement).innerHTML = "";
    document.getElementById(appendToElement).appendChild(node);
}

const addOptionHtmlElement = (addToSelectElement, elementToAppend, text) => {
    const node = document.createElement(elementToAppend); // Create a <option> node
    const textnode = document.createTextNode(text); // Create a text node
    node.value = text;
    node.appendChild(textnode);
    document.getElementById(addToSelectElement).appendChild(node);
}

/*=================*/
/*  URL functions  */
/*=================*/
const getURLParameter = (name) => {
    let p = (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1];
    if (p === null)
        return null;
    else {
        return decodeURI(p);
    }
}

const setParameterToURL = (paramName, paramValue, paramUrl) => {
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
    window.location.href = url;
}

/*==============================*/
/*  Utilities Initializations   */
/*==============================*/
const spContextObject = {

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

    User: {
        LogInName: null,
        ID: null,
        DisplayName: null,
        Email: null
    },

    BrowserDetails: {
        IsIE: false,
        TrueVersion: 0,
        ActingVersion: 0,
        CompatibilityMode: false
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
    }

}

const sharepointReady = async() => {
    //Get user data using restapi
    const user = await getCurrentUser();
    //User Info
    spContextObject.User.ID = user.Id;
    spContextObject.User.DisplayName = user.Title;
    spContextObject.User.LogInName = user.LoginName;
    spContextObject.User.Email = user.Email;
    //Save to sessionStorage
    sessionStorage.setItem('currentUser', JSON.stringify(spContextObject.User));
    //Current Date
    spContextObject.CONSTANTS.CURRENTDATE = getCurrentDate();
    sessionStorage.setItem("__REQUESTDIGEST", JSON.stringify(document.getElementById("__REQUESTDIGEST").value))

    clientContext = SP.ClientContext.get_current();
    webSite = clientContext.get_web();
    site = clientContext.get_site();
    rootWeb = site.get_rootWeb();
    oGroup = webSite.get_associatedOwnerGroup();
    clientContext.load(webSite);
    clientContext.load(site);
    clientContext.load(rootWeb);
    clientContext.load(oGroup);
    //Executes the current pending request asynchronously on the server
    clientContext.executeQueryAsync(onSharepointReadySuccess, onSharepointReadyFail);

}

const onSharepointReadySuccess = () => {
    console.log(`${new Date()} :SharePoint ready`);
    //Init CONSTANS
    spContextObject.CONSTANTS.WEBAPPLICATIONURL = window.location.protocol + "//" + window.location.host;
    spContextObject.CONSTANTS.SITEABSOLUTEURL = site.get_serverRelativeUrl();
    spContextObject.CONSTANTS.SITESERVERRELATIVEURL = site.get_url();
    spContextObject.CONSTANTS.SITECONTEXT = webSite.get_url();
    spContextObject.CONSTANTS.WEBSERVERRELATIVEURL = webSite.get_serverRelativeUrl();
    init();
}

const onSharepointReadyFail = (sender, args) => {
    console.log('Error : ' + args.get_message());
}

//Init objects before the DOM Loaded
const init = () => {
    showHideSPTopPanel()
    load();
}

const load = () => {
    bindAlertButton();
}

const showHideSPTopPanel = () => {
    //init showSPPanel value in sessionStorage
    const showPanel = sessionStorage.getItem("showSPPanel");
    const suiteBarTop = document.getElementById('suiteBarTop');
    const ribbon = document.getElementById('ms-designer-ribbon');
    if (isEmpty(showPanel)) {
        sessionStorage.setItem("showSPPanel", false);
    } else {
        if (JSON.parse(showPanel)) {
            suiteBarTop.style.display = 'block';
            ribbon.style.display = 'block';
            sessionStorage.setItem("showSPPanel", true);
        }
    }

    let keysPressed = {};
    document.addEventListener("keydown", function(event) {
        const showPanel = sessionStorage.getItem("showSPPanel");
        const suiteBarTop = document.getElementById('suiteBarTop');
        const ribbon = document.getElementById('ms-designer-ribbon');
        keysPressed[event.key] = true;
        //CTRL+ALT+a
        if (keysPressed['Control'] && keysPressed['Alt'] && (event.key == 'a' || event.key == 'ש')) {
            if (!(JSON.parse(showPanel))) {
                suiteBarTop.style.display = 'block';
                ribbon.style.display = 'block';
                sessionStorage.setItem("showSPPanel", true);
            } else {
                suiteBarTop.style.display = 'none';
                ribbon.style.display = 'none';
                sessionStorage.setItem("showSPPanel", false);
            }
        }
    });

    document.addEventListener('keyup', (event) => {
        delete keysPressed[event.key];
    });
}

//Ensures that the specified file that contains the specified function is loaded and then runs the specified callback function.
SP.SOD.executeFunc('sp.js', 'SP.ClientContext', sharepointReady);