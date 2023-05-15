jQuery(document).ready(function ($) {

    //get "IssueID" from Query String
    var vals = new Object();
    var qs = location.search.substring(1, location.search.length);
    var args = qs.split("&");
    for (var i = 0; i < args.length; i++) {
        var nameVal = args[i].split("=");
        var temp = unescape(nameVal[1]).split('+');
        nameVal[1] = temp.join(' ');
        vals[nameVal[0]] = nameVal[1];
    }
    var orderID = vals["orderId"];

    //Set the Lookup field with dislay name of "IssueID" to the item with value from Query String
    //alert(orderID);


    //get user department
    var userData = {};
    $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties",
        headers: { Accept: "application/json;odata=verbose" },
        success: function (response) {
            try {
                //Get properties from user profile Json response  
                // userData.userDisplayName = response.d.DisplayName;  
                //userData.AccountName = response.d.AccountName;
                //userData.Title = response.d.Title;
                var properties = response.d.UserProfileProperties.results;
                for (var i = 0; i < properties.length; i++) {
                    var property = properties[i];
                    if (property.Key == "Department") {
                        userData.Department = property.Value;
                        console.log("מחלקה: " + property.Value);
                        //alert(property.Value);  
                    }
                }

            } catch (err2) {
                console.error(JSON.stringify(err2));
            }
        },
        error: function (jQxhr, errorCode, errorThrown) {
            console.error(errorThrown);
        }
    });



    setTimeout(function () {
        setLookup("#ctl00_ctl37_g_4549009a_14ea_4b63_9a86_4fe40199234b_FormControl0_V1_I1_D18", orderID);
        var new_Columns = [
            { "Source": "SpIpText", "DispColumnName": "ctl00_ctl37_g_4549009a_14ea_4b63_9a86_4fe40199234b_FormControl0_V1_I1_T1", "DispSourceList": "אנשי קשר", "SourceColumn": "FullName", "CAMLQuery": "<Eq><FieldRef Name='WorkCity'/><Value Type='text'>" + userData.Department + "</Value></Eq>" }
            //{ "Source" : "SpIpText", "DispColumnName" : "ctl00_ctl37_g_4549009a_14ea_4b63_9a86_4fe40199234b_FormControl0_V1_I1_T1", "DispSourceList" : "אנשי קשר", "SourceColumn" :"FullName"}
        ];
        acMain(new_Columns);
    }, 200);

});

function setSelectValue(theSelect, value) {
    Array.prototype.forEach.call(theSelect.children, function (el) { if (el.value == value.toString()) { el.selected = true } });
}

function setLookup(fieldTitle, lookupVal) {
    if ($(fieldTitle)[0].length && lookupVal.length) {
        //console.log("found");
        $('#ctl00_ctl37_g_4549009a_14ea_4b63_9a86_4fe40199234b_FormControl0_V1_I1_D18')[0].focus();
        setTimeout(function () {
            setSelectValue($('#ctl00_ctl37_g_4549009a_14ea_4b63_9a86_4fe40199234b_FormControl0_V1_I1_D18')[0], lookupVal.toString());
            $('#ctl00_ctl37_g_4549009a_14ea_4b63_9a86_4fe40199234b_FormControl0_V1_I1_D18')[0].blur();
            $('#ctl00_ctl37_g_4549009a_14ea_4b63_9a86_4fe40199234b_FormControl0_V1_I1_D18').trigger("change");
            $('#ctl00_ctl37_g_4549009a_14ea_4b63_9a86_4fe40199234b_FormControl0_V1_I1_D18')[0].focus();
        }, 300);
    }
    else {
        console.log("not found");
    }

}
