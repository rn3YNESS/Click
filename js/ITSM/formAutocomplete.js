var subjectList = [];
var sourcelist = '';
var interval;
var i = 1;
//הקוד עובד רק בטופס שנפתח לא בתיבת דו שיח
//אם נזרקת שגיאה מטופס האינפופט עקב כשל שליפת נתונים משתמש אז גם האוטוקומפליט לא יעבוד כי הקוד לא מצליח לגשת לשדה נושא הקריאה
jQuery(document).ready(function ($) {

   // if ( /*@cc_on!@*/false || !!document.documentMode) {


        interval = setInterval(getSubjects, 100);

 //   }
  //  else { open('blank', '_self'); window.document.write('<p style="font-size: 40px;color: midnightblue;text-align: -webkit-center;">דפדפן זה אינו נתמך, יש לעבור לאקספלורר</p>'); }
});


function getSubjects() {
    sourcelist = document.getElementById('ctl00_ctl37_g_be1b5a7c_2b3f_432a_95c6_e5fd9b1e17d9_FormControl0_V1_I1_D6');
    //ctl00_ctl37_g_be1b5a7c_2b3f_432a_95c6_e5fd9b1e17d9_
    sourcelist.focus();
    sourcelist = document.getElementById('ctl00_ctl37_g_be1b5a7c_2b3f_432a_95c6_e5fd9b1e17d9_FormControl0_V1_I1_D6');
    
    if (sourcelist.options.length>25) {
        clearInterval(interval);

        for (i = 0; i < sourcelist.options.length; i++) {

            var item = [];
            item.realVal=sourcelist.options[i].value;
            item.tempLabel = sourcelist.options[i].value;
            item.tempLabel = item.tempLabel.replace("#", " - ");
            item.label = item.tempLabel;
            subjectList.push(item);
        }
        /*hide select element (drop down box) that contains all the options*/
sourcelist.style.visibility= "hidden";
subjectList.sort(compare);
        setAutocomplete();
    }

}


function setAutocomplete() {

    //subjectList.sort();
    var subjectFieldOBJECT = $("input[id$='FormControl0_V1_I1_T7']");
    //var realVal =  document.getElementById('ctl00_ct137_g_be1b5a7c_2b3f_432a_95c6_e5fd9b1e17d9_FormControl0_V1_I1_T14');//ctl00_ctl37_g_be1b5a7c_2b3f_432a_95c6_e5fd9b1e17d9_FormControl0_V1_I1_D7
    var realVal =  $("input[id$='FormControl0_V1_I1_T13']");
    //add styling to form
    var styleEl = document.createElement('style');
    styleEl.innerHTML = '.ui-autocomplete{background: white;list-style-type: none; padding:4px;height:200px; width:10px; overflow: auto; border:1px solid #cccccc;}li:hover{background: lightblue;}';

    document.head.appendChild(styleEl);

    //create an image button that display the full subject list  
    var img = document.createElement("IMG");
    img.setAttribute("src", "/../Style Library/Images/autocomplete.gif");
    img.setAttribute("alt", "הצג הכל");
    img.setAttribute("id", "imgautocomplete");
    img.onclick = function () { subjectFieldOBJECT.autocomplete("search", " -"); };

    subjectFieldOBJECT[0].parentNode.insertBefore(img, subjectFieldOBJECT[0].nextSibling);


    subjectFieldOBJECT.autocomplete({
        source: subjectList,
        focus: function (event, ui) {
            subjectFieldOBJECT.val(ui.item.label); return false;
        },
        select: function (event, ui) {
            subjectFieldOBJECT.val(ui.item.label);
            
  realVal[0].focus(); 
  realVal[0].value = ui.item.realVal;      
  realVal[0].blur();

            return false;
        },
        minLength: 0,
        autoFocus: false,
        change: function (event, ui) {
            if ( ui.item ) {return;}
            if (!ui.item) {
               // $(this).val('');
           var value = subjectFieldOBJECT.val(),
          valueLowerCase = value.toLowerCase(),
          valueLowerCase = valueLowerCase.replace(" - ", "#");
          valid = false;
          //sourcelist = $('select[id$="ctl00_ctl37_g_be1b5a7c_2b3f_432a_95c6_e5fd9b1e17d9_FormControl0_V1_I1_D7"]');
          sourcelist=document.getElementById("ctl00_ctl37_g_be1b5a7c_2b3f_432a_95c6_e5fd9b1e17d9_FormControl0_V1_I1_D6");
        //sourcelist.children.forEach((child) =>
        for(let candidateVal of sourcelist.children)
         {
          if ( candidateVal.innerText.toLowerCase() === valueLowerCase ) {
            this.val = valid = true;
            //return false;
          }
        }//);
 
        // Found a match, nothing to do
        if (!valid ) {
		$(this).val('');
		return;
        }

            }
        },
        position: { my: "right top", at: "right bottom" }
    }).data("ui-autocomplete")._renderItem = function (ul, item) {
        // bold a letters that typed by user   
        if (subjectFieldOBJECT.value != '') {
            item.tempLabel = item.tempLabel.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
        }
        return $("<li>")
            .attr("data-value", item)
            .append(item.tempLabel)
            .appendTo(ul);
    };

    // clear data
    //subjectFieldOBJECT.focusout(function () {
       // if (subjectFieldOBJECT[0].value === '') {
             // hiddenMainSubject.value ='';
              //hiddenSubSubject.value= '';   
     //   }
  //  });
}

function compare(a,b) {
  if (a.label < b.label)
    return -1;
  if (a.label > b.label)
    return 1;
  return 0;
}


