
    var isFieldRequired = null;

    function isFieldReq(isReq) {
        isFieldRequired = isReq;
    }

    var fields;
    function getSiteColumns() {
        var context = new SP.ClientContext(document.getElementById('txtSiteUrl').value);
        var web = context.get_web();
        fields = web.get_fields();
        context.load(fields);
        context.executeQueryAsync(getSiteColumnsSuccess, getSiteColumnsFail);
    }

    function getSiteColumnsSuccess() {
        var selectSiteCol = document.getElementById('selectSiteCol');
        selectSiteCol.innerHTML = '';
        var fieldEnum = fields.getEnumerator();
        var op = [];
        //sort
        while (fieldEnum.moveNext()) {
            var f = fieldEnum.get_current();
            op.push(f.get_title());
        }
        op.sort();
        //insert to select
        for (let index = 0; index < op.length; index++) {
            var option = document.createElement('option');
            option.text = op[index];
            selectSiteCol.add(option);
        }

    }

    function getSiteColumnsFail() {
        alert('Getting site column Failed');
    }


    function createSiteField() {
        var context = new SP.ClientContext(document.getElementById('txtSiteUrl').value);
        var web = context.get_web();
        var fields = web.get_fields();
        var fldSchema = "<Field Type='" + document.getElementById('selFieldType').value + "' Name='" + document.getElementById('txtInternalName').value + "' DisplayName='" + document.getElementById('txtDisplayName').value + "' Required='" + isFieldRequired + "' Group='" + document.getElementById('txtGroup').value + "' />";
        fields.addFieldAsXml(fldSchema);
        context.executeQueryAsync(Success, Fail);
    }

    function Success() {
        alert('SiteColumn is created successfully');
    }

    function Fail() {
        alert('site column Creation Failed');
    }



    //Content Type : 
    var contentTypeCollection;
    var c;

    function createContentType() {
        var ctx = c = new SP.ClientContext(document.getElementById('txtSiteUrl').value);
        if (ctx != undefined && ctx != null) {
            var web = ctx.get_web();
            contentTypeCollection = web.get_contentTypes();
            contentType = contentTypeCollection.getById("0x01");
            var newContentType = new SP.ContentTypeCreationInformation();
            newContentType.set_name(document.getElementById('txtDisplayNameCT').value);
            newContentType.set_group(document.getElementById('txtInternalNameGroup').value);
            newContentType.set_description(document.getElementById('txtDescriptionCT').value);
            newContentType.set_parentContentType(contentType);
            contentTypeCollection.add(newContentType);
            ctx.load(contentTypeCollection);
            ctx.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));
        }
    }

    var contentTypeId;
    var contentTypeEnumerator;
    function onQuerySucceeded() {
        contentTypeId;
        contentTypeEnumerator = contentTypeCollection.getEnumerator();
        while (contentTypeEnumerator.moveNext()) {
            var content = contentTypeEnumerator.get_current();
            if (content.get_name() == document.getElementById('txtDisplayNameCT').value) {
                contentTypeId = content.get_id();
            }
        }
        alert("Content Type created successfully")
    }

    function onQueryFailed(sender, args) {
        alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
    }

    function addColumnToContentType() {
        var col = document.getElementById('selectSiteCol').value;
        var cType = c.get_site().get_rootWeb().get_contentTypes().getById(contentTypeId);
        var field = c.get_site().get_rootWeb().get_fields().getByInternalNameOrTitle(col);
        c.load(cType);
        c.load(field);
        var fInfo = new SP.FieldLinkCreationInformation();
        fInfo.set_field(field);
        var fLink = cType.get_fieldLinks().add(fInfo);
        cType.update(true);
        c.load(fLink);
        c.executeQueryAsync(function () { alert("Content Type and field created successfully"); }, function (sender, args) { alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace()); });
    }

    var oList;
    var oWebsite;
    function createList() {
        var clientContext = new SP.ClientContext(document.getElementById('txtSiteUrl').value);
        oWebsite = clientContext.get_web();

        var listCreationInfo = new SP.ListCreationInformation();
        var olist = document.getElementById("txtListName").value;
        listCreationInfo.set_title(olist);
        listCreationInfo.set_templateType(SP.ListTemplateType.genericList);


        oList = oWebsite.get_lists().add(listCreationInfo);

        clientContext.load(oList);
        clientContext.executeQueryAsync(
            Function.createDelegate(this, this.oncreateListSucceeded),
            Function.createDelegate(this, this.oncreateListFailed)
        );
    }

    function oncreateListSucceeded() {
        alert('Creste Success');
        AddContentTypeToList();
    }

    function oncreateListFailed(sender, args) {
        alert('Request failed. ' + args.get_message() +
            '\n' + args.get_stackTrace());
    }

    function AddContentTypeToList() {
        var context = new SP.ClientContext(document.getElementById('txtSiteUrl').value);
        var currentWEB = context.get_web();
        //get list from host web  
        var lists = currentWEB.get_lists();
        //get rootweb  
        var rootWeb = context.get_site().get_rootWeb();
        //Get all content types from root web site  
        var allContentTypeColl = rootWeb.get_contentTypes();
        //load the web , lists & content types  
        context.load(rootWeb);
        context.load(allContentTypeColl);
        context.load(lists);
        context.executeQueryAsync(function () {
            var CTypeID;
            var contentTypeName = document.getElementById('selectSiteCT').value;
            //Get the Content type ID , if we know content type id we dont want to get the id again  
            var contentTypeEnum = allContentTypeColl.getEnumerator();
            while (contentTypeEnum.moveNext()) {
                var currentCT = contentTypeEnum.get_current();
                if (currentCT.get_name() == contentTypeName) {
                    CTypeID = currentCT.get_stringId();
                    break;
                }
            }
            var testList = context.get_web().get_lists().getByTitle(document.getElementById('txtListName').value);
            //Enable the content type in custom list  
            testList.set_contentTypesEnabled(true);
            testList.update();
            context.load(testList);
            var webContentTypes = context.get_site().get_rootWeb().get_contentTypes();
            var listCollectionCT = testList.get_contentTypes();
            var customCT = webContentTypes.getById(CTypeID);
            //then add the existing content type using content type id  
            listCollectionCT.addExistingContentType(customCT);
            //then load the list collection content types  
            context.load(listCollectionCT);
            var folder = testList.get_rootFolder();
            context.load(folder, 'ContentTypeOrder');
            context.executeQueryAsync(function () {
                //ordered the content type folder.set_uniqueContentTypeOrder(folder.get_contentTypeOrder().reverse());  
                folder.update();
                context.executeQueryAsync(

                    function () {
                        console.log("Content type was added");

                    },

                    function () {
                        console.log("Error in Adding Content Type" + args.get_message());

                    });
            }, function (sender, args) { onfail(sender, args); });
        }, function (sender, args) { onfail(sender, args); });
    }

    var contentTypeCollection;
    function getSiteContentTypesClick(){
        var ctx = c = new SP.ClientContext(document.getElementById('txtSiteUrl').value);
        if (ctx != undefined && ctx != null) {
            var web = ctx.get_web();
            contentTypeCollection = web.get_contentTypes();
            ctx.load(contentTypeCollection);
            ctx.executeQueryAsync(getSiteContentTypesClickSuccess, getSiteContentTypesClickFailed);
        }
    }

    function getSiteContentTypesClickSuccess(){
        getSiteContentTypes();
    }

    function getSiteContentTypesClickFailed(){

}


    function getSiteContentTypes() {
        var selectSiteCol = document.getElementById('selectSiteCT');
        selectSiteCol.innerHTML = '';
        contentTypeEnumerator = contentTypeCollection.getEnumerator();
        var op = [];
        //sort
        while (contentTypeEnumerator.moveNext()) {
            var content = contentTypeEnumerator.get_current();
            op.push({ name: content.get_name(), id: content.get_id().$12_1 });
        }
        op.sort(compare);
        //insert to select
        for (let index = 0; index < op.length; index++) {
            var option = document.createElement('option');
            option.text = op[index].name;
            option.id = op[index].id;
            selectSiteCol.add(option);
        }
    }

    function compare(a, b) {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    }    
