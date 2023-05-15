const myQueries_object = {

    GlobalVariables: {
        myQueriesCollection: [],
        myQueryItems: [],
    },
    Lists: {
        HE: "myQueries",
        EN: "myQueries",

    },
}

const userID_object = {

    GlobalVariables: {
        myuserIDs: [],
    }
}
// myQueries_object.Lists.HE
// myQueries_object.GlobalVariables.myQueriesCollection
// myQueries_object.GlobalVariables.myQueryItems
// userID_object.GlobalVariables.myuserIDs

const buildmyQueryUrl = (queryURL, list, beforeQueryString, selectedFields, filterByCommand, expand, orderBy, topItems) => {

    //let requestUri = _spPageContextInfo.webAbsoluteUrl;
    let requestUri = queryURL;
    //Select
    if (selectedFields !== null && selectedFields !== undefined)
        requestUri += `/_api/web/lists/GetByTitle('${list}')/items${beforeQueryString}?${selectedFields}`;
    else
        requestUri += `/_api/web/lists/GetByTitle('${list}')/items${beforeQueryString}?`;
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

const getQueryData = async (url) => {
    const response = await fetch(url, { headers: { 'Content-Type': 'application/json', 'accept': 'application/json' } }).then(response => { return response.json() })
        .then(responseData => {
            return responseData
        }).catch(error => {
            console.log(error);
        });
    return response;
}

const getMyQueryCollection = async () => {


    const myQueriesRequest = buildmyQueryUrl(_spPageContextInfo.webAbsoluteUrl, myQueries_object.Lists.HE, "", null, "&$filter=active eq 1", null, "&$OrderBy=displayOrder asc", null);  // `&$expand=AttachmentFiles`
    const myQueries = await getQueryData(myQueriesRequest);

    let result = [];

    //if (myQueries.value.length > 0) { result = myQueries.value };

    if (myQueries.value.length > 0) {
        for (const myQuery of myQueries.value) {

            var obj = new Object(myQuery);

            //if (userID_object.GlobalVariables.myuserIDs.find(u => u.sitePath == myQuery.sitePath))

            let quID = userID_object.GlobalVariables.myuserIDs.find(u => u.sitePath == myQuery.sitePath);

            if (quID == undefined){
                

                quID = await getUserByFullName();
                if (quID != null){
                    var IDobj = new Object();
                    IDobj.sitePath = myQuery.sitePath;
                    IDobj.Id = quID;
                    userID_object.GlobalVariables.myuserIDs.push(IDobj);

                }
            
            }

            //obj.userId = await getUserByFullName();
            

            if (quID != null) {
                //obj.queryId = myQuery.Id;
                obj.userId = quID;
                result.push(obj)
            }

        }
    }

    return result;

}



const getUserByFullName = async (fullName = _spPageContextInfo.userDisplayName) => {


    const requestUri = `${_spPageContextInfo.webAbsoluteUrl}/_api/web/ensureUser('${encodeURIComponent(fullName)}')`;
    //const data = await postData(requestUri, {}, "");
    const data = await postData(requestUri);
    if (isNullOrEmpty(data)) {
        return null;
    }
    return data.Id;
}




const isNullOrEmpty = (value) => {
    return (!value || value == undefined || value == "" || value.length == 0);
}
const postData = async function (url = '', data = {}, additionalHeaders = "") {
    const headers = {
        'Content-Type': 'application/json;odata=verbose',
        'X-RequestDigest': document.getElementById("__REQUESTDIGEST").value,
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

//========================================================================================



// Title	
// sitePath
// listDisplayName
// listInternalName
// select
// filterBy
// expand
// orderBy
// topLimit
// linkField
// titleField
// bodyField
// tooltipField
// displayColor
// displayOrder
// active

const queryParam = (paramName, paramValue) => {
    let result = "";
    if (paramValue != null) { result = `&$${paramName}=${paramValue}` };
    return result;
}

const myQueries = async () => {   //  ****************************** MAIN FUNCTION ******************************
    const content = document.getElementById("content");

    //get ACTIVE myQueries
    myQueries_object.GlobalVariables.myQueriesCollection = await getMyQueryCollection();
    //get userID for each site collection in myQueries List
    for (const query of myQueries_object.GlobalVariables.myQueriesCollection) {
        //get userID for site collection in myQueries List
        //const scUserId = await getSCUserId(query);

        let filterCurrentUser = `(${query.filterIdField} eq ${query.userId})`;
        if (query.filterTextField) {filterCurrentUser = `(${query.filterTextField} eq '${_spPageContextInfo.userDisplayName}')`};
        if (query.additionalFilters) {filterCurrentUser += ` and ${query.additionalFilters}`}

        const itemsURL = buildmyQueryUrl(query.sitePath, query.listDisplayName, "", queryParam("select", query.select), `&$filter=${filterCurrentUser}`, queryParam("expand", query.expand), queryParam("OrderBy", query.orderBy), queryParam("topItems", query.topLimit));
        const listItems = await getQueryData(itemsURL);
        if (listItems.value.length > 0) {

            //add dept
            for (const itm of listItems.value) {
                //itm.newparam = newparam;
                itm.queryId = query.Id;
                myQueries_object.GlobalVariables.myQueryItems.push(itm);
            }
            //myQueries_object.GlobalVariables.myQueryItems.push(listItems.value);

        }



    }

    for (const query of myQueries_object.GlobalVariables.myQueriesCollection) {

        const itmColl = myQueries_object.GlobalVariables.myQueryItems.filter(i => i.queryId == query.Id);
        if (itmColl.length > 0){

            //render Heading
            content.innerHTML += `<strong>${query.Title}</strong><br/>`;
            //render items
            for (const itm of itmColl) {
                //render item
                content.innerHTML += `${itm.Id} - ${itm.Title}<br/>`;
            }

        }

    }


    //for (const itm of myQueries_object.GlobalVariables.myQueryItems) {
    //    //render item
    //    content.innerHTML += `${itm.Title}<br/>`;
    //}



}           //  ****************************** END MAIN FUNCTION ******************************


window.addEventListener("load", function () {

    myQueries();


})