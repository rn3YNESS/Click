var PMOClick = window.PMOClick || {};


PMOClickMng = {

    GlobalVariables: {
        isFieldRequired: null,
        fields: null,
        contentTypeCollection: null,
        clientContext: null,
        contentTypeId: null,
        contentTypeEnumerator: null,
        oList: null,
        oWebsite: null,
        elm: null,
        listInfoCollection: null
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
        ClickConfig : {
            EN: 'ClickConfig'
        }
    },

    Init: function () {
        PMOClickMng.GlobalVariables.clientContext = SP.ClientContext.get_current();
        PMOClickMng.Methods.InitSitesOptions()
    },

    Methods: {
        //Automation
        StartAutomationProcess : function(){ 
            var requestUri = PMOClick.CONSTANTS.WEBABSOLUTEURL + "/_catalogs/masterpage/click/json/components.json";
            var a = PMOClick.Methods.GetListItemsREST(PMOClick.CONSTANTS.WEBAPPLICATIONURL, PMOClickMng.Lists.ClickConfig.EN, null, null, null, null, null);                   
            var b = JSON.parse(a.value[0].value);
            PMOClickMng.GlobalVariables.clientContext = new SP.ClientContext(document.getElementById('txtSiteUrl').value);//Context
            PMOClickMng.GlobalVariables.oWebsite = PMOClickMng.GlobalVariables.clientContext.get_web();//SPWeb
            PMOClickMng.GlobalVariables.contentTypeCollection = PMOClickMng.GlobalVariables.oWebsite.get_contentTypes();//ContentType
            PMOClickMng.GlobalVariables.fields = PMOClickMng.GlobalVariables.oWebsite.get_fields();            
            /*$.each(b.Fields.Field,function(i,v){
                var fldSchema = null;
                if(v.value == "Choice"){
                    fldSchema = "<Field Type='" + v.Type + "' Name='" + v.Name + "' DisplayName='" + v,DisplayName + "' Required='" + v.Required + "' Group='" + v.Group + "'><CHOICES><CHOICE>מסמך</CHOICE><CHOICE>דף</CHOICE><CHOICE>טופס</CHOICE></CHOICES></Field>";
                }
                else{
                    fldSchema = "<Field Type='" + v.Type + "' Name='" + v.Name + "' DisplayName='" + v.DisplayName + "' Required='" + v.Required + "' Group='" + v.Group  + "' />";
                }       
                PMOClickMng.GlobalVariables.fields.addFieldAsXml(fldSchema);
                PMOClickMng.GlobalVariables.clientContext.executeQueryAsync(PMOClickMng.Methods.CreateSiteColumnSuccess, PMOClickMng.Methods.CreateSiteColumnFailed);          
            }) */ 
            
            b = JSON.parse(a.value[1].value);
            $.each(b.ContentTypes.ContentType,function(i,v){            
            var contentType = PMOClickMng.GlobalVariables.contentTypeCollection.getById(v.Parent);//selContentTypeParent
            var newContentType = new SP.ContentTypeCreationInformation();
            newContentType.set_name(v.Name);
            newContentType.set_group(v.Group);
            newContentType.set_description(v.Description);
            newContentType.set_parentContentType(contentType);
            PMOClickMng.GlobalVariables.contentTypeCollection.add(newContentType);
            PMOClickMng.GlobalVariables.clientContext.load(PMOClickMng.GlobalVariables.contentTypeCollection, 'Include(Id,Name)');
            PMOClickMng.GlobalVariables.clientContext.executeQueryAsync(PMOClickMng.Methods.CreateContentTypeSucceeded, PMOClickMng.Methods.CreateContentTypeFailed);            
            })   
        },
        /*========================*/
        /*  Get Site URL Options  */
        /*========================*/
        InitSitesOptions: function(){
            selectURLSites = document.getElementById('txtSiteUrl')
            var items = PMOClick.Methods.RequestResultsFromSearchAPI("querytext='Path:" + PMOClick.CONSTANTS.WEBAPPLICATIONURL + " AND  contentclass:STS_Site'", "&rowlimit=500", "&selectproperties='Title,url,contentclass,ParentLink'", null, null);
            $.each(items.PrimaryQueryResult.RelevantResults.Table.Rows, function (i, option) {
                var optionHtml = document.createElement('option');
                optionHtml.text = option.Cells[3].Value;
                selectURLSites.add(optionHtml);
            });
        },

        /*================*/
        /*  Site Columns  */
        /*================*/
        GetSiteColumns: function () {
            PMOClickMng.GlobalVariables.clientContext = new SP.ClientContext(document.getElementById('txtSiteUrl').value);//GetContext from input text - site url
            PMOClickMng.GlobalVariables.oWebsite = PMOClickMng.GlobalVariables.clientContext.get_web();
            PMOClickMng.GlobalVariables.fields = PMOClickMng.GlobalVariables.oWebsite.get_fields();
            PMOClickMng.GlobalVariables.clientContext.load(PMOClickMng.GlobalVariables.fields);
            PMOClickMng.GlobalVariables.clientContext.executeQueryAsync(PMOClickMng.Methods.GetSiteColumnsSuccess, PMOClickMng.Methods.GetSiteColumnsFail);
        },

        GetSiteColumnsSuccess: function () {
            var selectSiteCol = document.getElementById('selectSiteCol');
            selectSiteCol.innerHTML = '';
            var fieldEnum = PMOClickMng.GlobalVariables.fields.getEnumerator();
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

        },

        GetSiteColumnsFail: function () {
            alert('Getting site column Failed');
        },

        CreateSiteColumn: function () {
            PMOClickMng.GlobalVariables.clientContext = new SP.ClientContext(document.getElementById('txtSiteUrl').value);
            PMOClickMng.GlobalVariables.oWebsite = PMOClickMng.GlobalVariables.clientContext.get_web();
            PMOClickMng.GlobalVariables.fields = PMOClickMng.GlobalVariables.oWebsite.get_fields();
            var fldSchema = null;
            if(document.getElementById('selFieldType').value == "Choice"){
                fldSchema = "<Field Type='" + document.getElementById('selFieldType').value + "' Name='" + document.getElementById('txtInternalName').value + "' DisplayName='" + document.getElementById('txtDisplayName').value + "' Required='" + PMOClickMng.GlobalVariables.isFieldRequired + "' Group='" + document.getElementById('txtGroup').value + "'><CHOICES><CHOICE>מסמך</CHOICE><CHOICE>דף</CHOICE><CHOICE>טופס</CHOICE></CHOICES></Field>";
            }
            else{
                fldSchema = "<Field Type='" + document.getElementById('selFieldType').value + "' Name='" + document.getElementById('txtInternalName').value + "' DisplayName='" + document.getElementById('txtDisplayName').value + "' Required='" + PMOClickMng.GlobalVariables.isFieldRequired + "' Group='" + document.getElementById('txtGroup').value + "' />";
            }
            
            PMOClickMng.GlobalVariables.fields.addFieldAsXml(fldSchema);
            PMOClickMng.GlobalVariables.clientContext.executeQueryAsync(PMOClickMng.Methods.CreateSiteColumnSuccess, PMOClickMng.Methods.CreateSiteColumnFailed);
        },

        CreateSiteColumnSuccess: function () {
            PMOClick.Methods.AddStatus("יצירת עמודת אתר : ", "יצירת עמודת אתר הצליחה",true, "green");
            //alert('SiteColumn is created successfully');
        },

        CreateSiteColumnFailed: function (sender,args) {
            PMOClick.Methods.AddStatus("יצירת עמודת אתר","יצירת עמודת אתר נכשלה : \n" + args.get_message() + "\n" + args.get_stackTrace(),false, "red");            
        },


        /*=====================*/
        /*  Site ContentTypes  */
        /*=====================*/
        GetSiteContentTypesClick: function (elm) {
            PMOClickMng.GlobalVariables.elm = elm;
            PMOClickMng.GlobalVariables.clientContext = new SP.ClientContext(document.getElementById('txtSiteUrl').value);
            PMOClickMng.GlobalVariables.oWebsite = PMOClickMng.GlobalVariables.clientContext.get_web();
            PMOClickMng.GlobalVariables.contentTypeCollection = PMOClickMng.GlobalVariables.oWebsite.get_contentTypes();
            PMOClickMng.GlobalVariables.clientContext.load(PMOClickMng.GlobalVariables.contentTypeCollection);
            PMOClickMng.GlobalVariables.clientContext.executeQueryAsync(PMOClickMng.Methods.GetSiteContentTypesClickSuccess, PMOClickMng.Methods.GetSiteContentTypesClickFailed);
        },

        GetSiteContentTypesClickSuccess: function () {
            PMOClickMng.Methods.GetSiteContentTypes(PMOClickMng.GlobalVariables.elm);
        },

        GetSiteContentTypesClickFailed: function () {

        },


        GetSiteContentTypes: function (el) {
            var selectSiteCol = document.getElementById(el);
            selectSiteCol.innerHTML = '';
            PMOClickMng.GlobalVariables.contentTypeEnumerator = PMOClickMng.GlobalVariables.contentTypeCollection.getEnumerator();
            var op = [];
            //sort
            while (PMOClickMng.GlobalVariables.contentTypeEnumerator.moveNext()) {
                var content = PMOClickMng.GlobalVariables.contentTypeEnumerator.get_current();
                op.push({ name: content.get_name(), id: content.get_id().$12_1 });
            }
            op.sort(PMOClickMng.Methods.Compare);
            //insert to select
            for (let index = 0; index < op.length; index++) {
                var option = document.createElement('option');
                option.text = op[index].name;
                option.id = op[index].id;
                selectSiteCol.add(option);
            }
        },

        CreateContentType: function () {
            PMOClickMng.GlobalVariables.clientContext = new SP.ClientContext(document.getElementById('txtSiteUrl').value);
            PMOClickMng.GlobalVariables.oWebsite = PMOClickMng.GlobalVariables.clientContext.get_web();
            PMOClickMng.GlobalVariables.contentTypeCollection = PMOClickMng.GlobalVariables.oWebsite.get_contentTypes();
            var contentType = PMOClickMng.GlobalVariables.contentTypeCollection.getById(document.getElementById('selectSiteCT1').selectedOptions[0].id);//selContentTypeParent
            var newContentType = new SP.ContentTypeCreationInformation();
            newContentType.set_name(document.getElementById('txtDisplayNameCT').value);
            newContentType.set_group(document.getElementById('txtInternalNameGroup').value);
            newContentType.set_description(document.getElementById('txtDescriptionCT').value);
            newContentType.set_parentContentType(contentType);
            PMOClickMng.GlobalVariables.contentTypeCollection.add(newContentType);
            PMOClickMng.GlobalVariables.clientContext.load(PMOClickMng.GlobalVariables.contentTypeCollection, 'Include(Id,Name)');
            PMOClickMng.GlobalVariables.clientContext.executeQueryAsync(PMOClickMng.Methods.CreateContentTypeSucceeded, PMOClickMng.Methods.CreateContentTypeFailed);

        },

        CreateContentTypeSucceeded: function () {
            alert("Content Type created successfully")
        },

        CreateContentTypeFailed: function (sender, args) {
            alert('Request failed. \n ' + args.get_message() + '\n' + args.get_stackTrace());
        },

        AddColumnToContentType: function () {
            PMOClickMng.GlobalVariables.clientContext = new SP.ClientContext(document.getElementById('txtSiteUrl').value);
            PMOClickMng.GlobalVariables.oWebsite = PMOClickMng.GlobalVariables.clientContext.get_web();
            var col = document.getElementById('selectSiteCol').value;
            var cType = PMOClickMng.GlobalVariables.oWebsite.get_contentTypes().getById(document.getElementById('selectSiteCT1').selectedOptions[0].id);
            var field = PMOClickMng.GlobalVariables.oWebsite.get_fields().getByInternalNameOrTitle(col);
            PMOClickMng.GlobalVariables.clientContext.load(cType);
            PMOClickMng.GlobalVariables.clientContext.load(field);
            var fInfo = new SP.FieldLinkCreationInformation();
            fInfo.set_field(field);
            var fLink = cType.get_fieldLinks().add(fInfo);
            cType.update(true);
            PMOClickMng.GlobalVariables.clientContext.load(fLink);
            PMOClickMng.GlobalVariables.clientContext.executeQueryAsync(PMOClickMng.Methods.AddColumnToContentTypeSucceeded, PMOClickMng.Methods.AddColumnToContentTypeFailed);
        },

        AddColumnToContentTypeSucceeded: function () {
            alert("Content Type and field created successfully");
        },

        AddColumnToContentTypeFailed: function (sender, args) {
            alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
        },

        /*================*/
        /*  Site Lists    */
        /*================*/
        GetLists: function () {
            PMOClickMng.GlobalVariables.clientContext = new SP.ClientContext(document.getElementById('txtSiteUrl').value);
            PMOClickMng.GlobalVariables.oWebsite = PMOClickMng.GlobalVariables.clientContext.get_web();
            var collList = PMOClickMng.GlobalVariables.oWebsite.get_lists();

            PMOClickMng.GlobalVariables.listInfoCollection = PMOClickMng.GlobalVariables.clientContext.loadQuery(collList, 'Include(Title, Id)');

            PMOClickMng.GlobalVariables.clientContext.executeQueryAsync(PMOClickMng.Methods.GetListsSucceeded, PMOClickMng.Methods.GetListsFailed);
        },

        GetListsSucceeded: function () {
            var listInfo = '';
            document.getElementById('selectSiteLists').innerHTML = '';
            var selectSitesList = document.getElementById('selectSiteLists');
            for (var i = 0; i < PMOClickMng.GlobalVariables.listInfoCollection.length; i++) {
                var oList = PMOClickMng.GlobalVariables.listInfoCollection[i];
                var op = [];
                //sort
                op.push({ title: oList.get_title(), id: oList.get_id().toString() });

                op.sort(PMOClickMng.Methods.Compare);
                //insert to select                
                for (let index = 0; index < op.length; index++) {
                    var option = document.createElement('option');
                    option.text = op[index].title;
                    option.id = op[index].id;
                    selectSitesList.add(option);
                }
            }
        },

        GetListsFailed: function (sender, args) {
            alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
        },

        CreateList: function () {
            PMOClickMng.GlobalVariables.clientContext = new SP.ClientContext(document.getElementById('txtSiteUrl').value);
            PMOClickMng.GlobalVariables.oWebsite = PMOClickMng.GlobalVariables.clientContext.get_web();

            var listCreationInfo = new SP.ListCreationInformation();
            var olist = document.getElementById("txtListName").value;
            listCreationInfo.set_title(olist);
            listCreationInfo.set_templateType(SP.ListTemplateType.genericList);


            PMOClickMng.GlobalVariables.oList = PMOClickMng.GlobalVariables.oWebsite.get_lists().add(listCreationInfo);

            PMOClickMng.GlobalVariables.clientContext.load(PMOClickMng.GlobalVariables.oList);
            PMOClickMng.GlobalVariables.clientContext.executeQueryAsync(PMOClickMng.Methods.CreateListSucceeded, PMOClickMng.Methods.CreateListFailed);
        },

        CreateListSucceeded: function () {
            alert('List was created Successfully');
        },

        CreateListFailed: function (sender, args) {
            alert('Request failed. ' + args.get_message() +
                '\n' + args.get_stackTrace());
        },

        AddContentTypeToList: function () {
            PMOClickMng.GlobalVariables.clientContext = new SP.ClientContext(document.getElementById('txtSiteUrl').value);
            PMOClickMng.GlobalVariables.oWebsite = PMOClickMng.GlobalVariables.clientContext.get_web();
            //Get list
            var list = PMOClickMng.GlobalVariables.oWebsite.get_lists().getById(document.getElementById('selectSiteLists').selectedOptions[0].id)
            //Get ContentType
            var cType = PMOClickMng.GlobalVariables.oWebsite.get_contentTypes().getById(document.getElementById('selectSiteCT2').selectedOptions[0].id);
            //Enable the content type in custom list  
            list.set_contentTypesEnabled(true);
            list.update();
            PMOClickMng.GlobalVariables.clientContext.load(list);
            var listCollectionCT = list.get_contentTypes();
            //then add the existing content type using content type id  
            listCollectionCT.addExistingContentType(cType);
            //then load the list collection content types  
            PMOClickMng.GlobalVariables.clientContext.load(listCollectionCT);
            var folder = list.get_rootFolder();
            PMOClickMng.GlobalVariables.clientContext.load(folder, 'ContentTypeOrder');
            PMOClickMng.GlobalVariables.clientContext.executeQueryAsync(function () {
                //ordered the content type folder.set_uniqueContentTypeOrder(folder.get_contentTypeOrder().reverse());  
                folder.update();
                PMOClickMng.GlobalVariables.clientContext.executeQueryAsync(function () { alert("Content type was added"); }, function () { alert("Error in Adding Content Type" + args.get_message()); });
            }, function (sender, args) { onfail(sender, args); });
        },

        /*==========*/
        /*  General */
        /*==========*/
        Compare: function (a, b) {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        },

        IsFieldReq: function (isReq) {
            PMOClickMng.GlobalVariables.isFieldRequired = isReq;
        }
    }
}

// PMOClickMng.Init();