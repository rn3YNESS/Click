var PMOClick = window.PMOClick || {};


PMOClickTasksDocs = {

    BrowserDetails: {
        IsIE: false,
        TrueVersion: 0,
        ActingVersion: 0,
        CompatibilityMode: false
    },

    GlobalVariables : {
         myTasks : null,
         myDocs : new Array(),
         listFoldersName : new Array(),
         files : new Array()
    },

    CONSTANTS: {
        SITECONTEXT: '',
        SITEABSOLUTEURL: '',
        SITESERVERRELATIVEURL: '',
        WEBABSOLUTEURL: '',
        WEBSERVERRELATIVEURL: '',
        FORMMODE: null,
        TIMER: '',
        CURRENTDATE: null
    },

    Pages: {

    },

    Lists: {
        myTasks : {
            HE : "מעקב משימות"
        }
    },

    Init: function () {  
        //Init Accrodion
        PMOClickTasksDocs.Methods.InitAccordiion();
        PMOClickTasksDocs.Methods.initTasks();
        PMOClickTasksDocs.Methods.initDocs();
    },

    Load: function () {
      
    },


    Methods: {
        InitAccordiion : function(){
            var coll = document.getElementsByClassName("collapsible");
            var i;
            for (i = 0; i < coll.length; i++) {
                coll[i].addEventListener("click", function() {
                    if(this.classList.contains("collapsible"))
                    {
                        this.classList.toggle("active");
                        this.classList.remove("collapsible");
                    }
                    else
                        if(this.classList.contains("active"))
                        {
                            this.classList.toggle("collapsible");
                            this.classList.remove("active");
                        }
                    var content = this.parentElement.nextElementSibling;
                    if (content.style.display === "block") {
                        content.style.display = "none";
                    } 
                    else {
                        content.style.display = "block";
                    }
                });
            }
        },

        initTasks : function(){
            PMOClickTasksDocs.GlobalVariables.myTasks = PMOClick.Methods.GetListItems(PMOClickTasksDocs.Lists.myTasks.HE, null, "$filter=AssignedToId eq " +  PMOClick.User.ID, null,  null);
            var htmlDiv = '<div class="col-lg-12 {0} taskContentText"><div class="row spaceRow"><div class="col-lg-6">{1}'+
            '</div></div><div class="row spaceRow"><div class="col-lg-7">{2} ימים&nbsp;|&nbsp;{4}</div>'+
            '<div class="col-lg-5 textLeft"><a class="pointer" style="text-decoration: underline;" id={3} onclick="PMOClickTasksDocs.Methods.openPopUp(this.id)">פרטים נוספים</a></div></div></div>';

            var htmlDivPostDate = '<div class="col-lg-12 {0} taskContentText"><div class="row spaceRow"><div class="col-lg-6">{1}'+
            '</div></div><div class="row spaceRow"><div class="col-lg-7">מתעכב ב {2} ימים&nbsp;|&nbsp;{4}</div>'+
            '<div class="col-lg-5 textLeft"><a class="pointer" style="text-decoration: underline;" id={3} onclick="PMOClickTasksDocs.Methods.openPopUp(this.id)">פרטים נוספים</a></div></div></div>';

            var htmlGroupDiv = '<div class="row groupText"><div class="col-lg-12">{1} ({0})</div></div>';
            var taskDiv = '';
            var group='';
            var  i = 0;
            var date;
            var currentDate = PMOClickTasksDocs.Methods.parseDate(PMOClick.Methods.GetCurrentDate());
            var tasks = jQuery.grep(PMOClickTasksDocs.GlobalVariables.myTasks, function(task) {
                return (task.Status == "לא התחילה" || task.Status == "מתבצע");
            });
            if(tasks.length > 0)
            {
                while(tasks[i] != null)
                {
                    date = PMOClickTasksDocs.Methods.parseDate(PMOClick.Methods.ConvertDateToCustomDate(tasks[i].DueDate));
                    if(PMOClickTasksDocs.Methods.datediff(date, currentDate) >= 0)
                        taskDiv += String.format(htmlDiv, "green", tasks[i].Title, PMOClickTasksDocs.Methods.datediff(date, currentDate), tasks[i].Id, tasks[i].Priority);
                    else
                        taskDiv += String.format(htmlDivPostDate, "green", tasks[i].Title, PMOClickTasksDocs.Methods.datediff(date, currentDate)*-1, tasks[i].Id, tasks[i].Priority);
                    i++;
                }
            
                group = String.format(htmlGroupDiv, tasks.length, "משימות פתוחות");
                group += taskDiv;
                document.getElementById("tasks").innerHTML=group;
            }

            // tasks = jQuery.grep(PMOClickTasksDocs.GlobalVariables.myTasks, function(task) {
            //     return (task.Status == "מתבצע");
            // });
            // if(tasks.length > 0)
            // {
            //     i = 0;
            //     taskDiv = '';
            //     while(tasks[i] != null)
            //     {
            //         date = PMOClickTasksDocs.Methods.parseDate(PMOClick.Methods.ConvertDateToCustomDate(tasks[i].DueDate));
            //         if(PMOClickTasksDocs.Methods.datediff(date, currentDate) >= 0)
            //             taskDiv += String.format(htmlDiv, "yellow", tasks[i].Title, PMOClickTasksDocs.Methods.datediff(date, currentDate), "", tasks[i].Priority);
            //         else
            //             taskDiv += String.format(htmlDivPostDate, "yellow", tasks[i].Title, PMOClickTasksDocs.Methods.datediff(date, currentDate)*-1, "", tasks[i].Priority);
            //         i++;
            //     }
            //     group = String.format(htmlGroupDiv, tasks.length, "משימות בעבודה");
            //     group += taskDiv;
            //     document.getElementById("tasks").innerHTML+=group;
            // }

            tasks = jQuery.grep(PMOClickTasksDocs.GlobalVariables.myTasks, function(task) {
                return (task.Status == "הושלם" || task.Status == "נדחה");
            });
            if(tasks.length > 0)
            {
                i = 0;
                taskDiv = '';
                while(tasks[i] != null)
                {
                    date = PMOClickTasksDocs.Methods.parseDate(PMOClick.Methods.ConvertDateToCustomDate(tasks[i].DueDate));
                    if(PMOClickTasksDocs.Methods.datediff(date, currentDate) >= 0)
                        taskDiv += String.format(htmlDiv, "blue", tasks[i].Title, PMOClickTasksDocs.Methods.datediff(date, currentDate), tasks[i].Id, tasks[i].Priority);
                    else
                        taskDiv += String.format(htmlDivPostDate, "blue", tasks[i].Title, PMOClickTasksDocs.Methods.datediff(date, currentDate)*-1, tasks[i].Id, tasks[i].Priority);
                    i++;
                }
                group = String.format(htmlGroupDiv, tasks.length, "משימות שהסתיימו");
                group += taskDiv;
                document.getElementById("tasks").innerHTML+=group;
            }

            tasks = jQuery.grep(PMOClickTasksDocs.GlobalVariables.myTasks, function(task) {
                return (task.Status == "ממתין למישהו אחר");
            });
            if(tasks.length > 0)
            {
                i = 0;
                taskDiv = '';
                while(tasks[i] != null)
                {
                    date = PMOClickTasksDocs.Methods.parseDate(PMOClick.Methods.ConvertDateToCustomDate(tasks[i].DueDate));
                    if(PMOClickTasksDocs.Methods.datediff(date, currentDate) >= 0)
                        taskDiv += String.format(htmlDiv, "red", tasks[i].Title, PMOClickTasksDocs.Methods.datediff(date, currentDate), tasks[i].Id, tasks[i].Priority);
                    else
                        taskDiv += String.format(htmlDivPostDate, "red", tasks[i].Title, PMOClickTasksDocs.Methods.datediff(date, currentDate)*-1, tasks[i].Id, tasks[i].Priority);
                    i++;
                }
                group = String.format(htmlGroupDiv, tasks.length, "משימות בהשהייה");
                group += taskDiv;
                document.getElementById("tasks").innerHTML+=group;
            }
        },

        initDocs : function(){
            var context = SP.ClientContext.get_current();
            var lists = context.get_web().get_lists();
            context.load(lists,'Include(RootFolder, BaseTemplate)');
            context.executeQueryAsync(
            function () {
                var enumerator = lists.getEnumerator();
                while (enumerator.moveNext()) {
                    var listFolder = enumerator.get_current();         
                    if (listFolder.get_baseTemplate() == '101')
                    {
                        PMOClickTasksDocs.GlobalVariables.listFoldersName.push(listFolder.get_rootFolder().get_name());
                    }
                }
                context.load(lists);
                context.executeQueryAsync(
                    function () {
                        var enumerator = lists.getEnumerator();
                        var index = 0;
                        while (enumerator.moveNext()) {
                            var list = enumerator.get_current();
                            if (list.get_baseTemplate() == '101')
                            {
                                PMOClickTasksDocs.Methods.getFolderFiles(index);
                                index++;
                            }
                        }
                    },
                    function (sender, args) {
                        console.log('error');
                    });
            },
                function (sender, args) {
                    console.log('error');
            });
        },
        
        getFolderFiles:function (index) {
            var context = SP.ClientContext.get_current();
            var web = context.get_web();
            var folder = web.getFolderByServerRelativeUrl(PMOClickTasksDocs.GlobalVariables.listFoldersName[index]);
            PMOClickTasksDocs.GlobalVariables.files.push(folder.get_files());
            context.load(PMOClickTasksDocs.GlobalVariables.files[index]);
            context.executeQueryAsync(function(){ PMOClickTasksDocs.Methods.success(index)}, function(){ PMOClickTasksDocs.Methods.failed});
        },

        success : function (index){
            if(PMOClickTasksDocs.GlobalVariables.files[index] != undefined && PMOClickTasksDocs.GlobalVariables.files[index] != null)
            {
                var listItemEnumerator = PMOClickTasksDocs.GlobalVariables.files[index].getEnumerator();
                while (listItemEnumerator.moveNext()) {
                    PMOClickTasksDocs.Methods.loadDoc(listItemEnumerator.get_current(), index) 
                }             
            }                                      
        },

        failed : function () {
            alert('failed. Message:' + args.get_message());
        },
        
        openPopUp : function(id){
            OpenPopUpPage("http://devpmoclick/Lists/taskList/DispForm.aspx?ID=" + id + "&Source=http/devpmoclick/Lists/taskList/AllItems.Easpx?Id=" + id + "&ContentTypeId=0x010800EEF6126264AD9D4C82BB677CBA1D2B5C");
        },

        loadDoc : function(doc, index){
            var htmlDiv = '<div class="col-lg-12 docContentText"><div class="row spaceRow"><a class="col-lg-6" href="{1}">{0}</a></div></div>';
            var docDiv;
            docDiv = String.format(htmlDiv, doc.get_name(), "http://devpmoclick/" + PMOClickTasksDocs.GlobalVariables.listFoldersName[index] + "/" + doc.get_name());
            document.getElementById("docs").innerHTML += docDiv;
        },

        parseDate : function (str) {
            var mdy = str.split('/');
            return new Date(mdy[2], mdy[1]-1, mdy[0]);
        },
        
        datediff : function (first, second) {
            return Math.round((first-second)/(1000*60*60*24));
        }
    }

}
