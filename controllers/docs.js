const initDocs = async() => {
    console.log(`${new Date()} : call initDocs at docs.js`);
    //Get all current user documents     
    const requestUriDocs = buildSearchQuery(`querytext='contentclass:STS_ListItem_DocumentLibrary AND IsDocument=true AND (Author:"${encodeURIComponent(spContextObject.User.DisplayName)}" OR ModifiedBy:"${encodeURIComponent(spContextObject.User.DisplayName)}" OR Author:"${encodeURIComponent((spContextObject.User.LogInName).split("i:0#.w|")[1])}" OR ModifiedBy:"${encodeURIComponent((spContextObject.User.LogInName).split("i:0#.w|")[1])}") AND Path:"${spContextObject.CONSTANTS.WEBAPPLICATIONURL}"'`, "&rowlimit=500", "&selectproperties='Title,Path,LastModifiedTime,FileExtension,ListItemId'", null, "&trimduplicates=false&sortlist='LastModifiedTime:descending'");
    const docsData = await getData(requestUriDocs);
    for (d of docsData.PrimaryQueryResult.RelevantResults.Table.Rows) {
        let document = {
            title: d.Cells[2].Value,
            path: d.Cells[3].Value,
            lastModifiedTime: d.Cells[4].Value,
            fileExtension: d.Cells[5].Value,
            listItemId: d.Cells[6].Value
        }
        personalDataObject.GlobalVariables.AllUserDocs.push(document);
    }

    let i = 0;
    for (const document of personalDataObject.GlobalVariables.AllUserDocs) {
        if (i < 20) {
            const icon = await getIcon(document.title, document.fileExtension);
            if (icon) {
                drawDoc(icon, document);
            }
        }
        i++;
    }
}

const getIcon = async(docTitle, docExtension) => {
    const requestUri = `${spContextObject.CONSTANTS.SITECONTEXT}/_api/web/mapToIcon(filename='${docTitle}.${docExtension}', progid='',size=1)`;
    const data = await getData(requestUri);
    if (data) {
        return data.value;
    }
    return null;
}

const drawDoc = (icon, doc) => {
    const imageSrc = `${spContextObject.CONSTANTS.SITECONTEXT}/_layouts/15/images/${icon}`;
    const schemeName = getSchemeNameForFileExtension(doc.fileExtension);
    if (!isNullOrEmpty(schemeName)) {
        var doc =
            `<div>
                <a class="doc__conatiner" target="_blank" href='${schemeName} :ofe|u| ${doc.path}'>
                    <img src='${imageSrc}' />&nbsp;&nbsp;
                    <span class='docContentText'> ${doc.title}.${doc.fileExtension}</span>
                </a>
            </div>`;
        document.getElementById('docs').innerHTML += doc;
    } else {
        var doc =
            `<div>
            <a class="doc__conatiner" target="_blank" href='${doc.path}'>
                <img src='${imageSrc}' />&nbsp;&nbsp;
                <span class='docContentText'> ${doc.title}.${doc.fileExtension}</span>
            </a>
        </div>`;
        document.getElementById('docs').innerHTML += doc;
    }
}

const getSchemeNameForFileExtension = (fileExtension) => {
    if (!isNullOrEmpty(fileExtension)) {
        fileExtension = fileExtension.toLowerCase();
        if (fileExtension === 'doc' || fileExtension === 'docm' || fileExtension === 'docx' || fileExtension === 'dot' || fileExtension === 'dotx') {
            return 'ms-word';
        } else if (fileExtension === 'pot' || fileExtension === 'potm' || fileExtension === 'potx' || fileExtension === 'ppam' || fileExtension === 'pps' || fileExtension === 'ppsm' || fileExtension === 'ppsx' || fileExtension === 'ppt' || fileExtension === 'pptm' || fileExtension === 'pptx') {
            return 'ms-powerpoint';
        } else if (fileExtension === 'odc' || fileExtension === 'xlm' || fileExtension === 'xls' || fileExtension === 'xlsb' || fileExtension === 'xlsm' || fileExtension === 'xlsx' || fileExtension === 'xlt' || fileExtension === 'xltb' || fileExtension === 'xltm' || fileExtension === 'xltx') {
            return 'ms-excel';
        } else if (fileExtension === 'vdw' || fileExtension === 'vdx' || fileExtension === 'vsd' || fileExtension === 'vsdm' || fileExtension === 'vsdx' || fileExtension === 'vsl' || fileExtension === 'vss' || fileExtension === 'vssm' || fileExtension === 'vst' || fileExtension === 'vstm' || fileExtension === 'vsu' || fileExtension === 'vsw' || fileExtension === 'vsx' || fileExtension === 'vtx' || fileExtension === 'vstx') {
            return 'ms-visio';
        } else if (fileExtension === 'mdb' || fileExtension === 'accdb' || fileExtension === 'accdt' || fileExtension === 'accdc' || fileExtension === 'accde' || fileExtension === 'accdr') {
            return 'ms-access';
        } else if (fileExtension === 'mpp' || fileExtension === 'mpt') {
            return 'ms-project';
        } else if (fileExtension === 'pub') {
            return 'ms-publisher';
        } else if (fileExtension === 'xsn') {
            return 'ms-infopath';
        }
    }
    return '';
}

const openWindowURL = (Url) => {
    window.open(PMOClick.CONSTANTS.SITESERVERRELATIVEURL + Url, "_self");
}

const openWindowWithData = () => {
    var searchData = $('.searchInput').val();
    var url = PMOClick.CONSTANTS.SITESERVERRELATIVEURL + "/pages/searchresults.aspx#k=" + searchData + "#l=1037";
    window.location.href = url;
}

initDocs();