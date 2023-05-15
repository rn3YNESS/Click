const personalDataObject = {
    GlobalVariables: {
        AllUserReminders: [],
        AllUserTasks: [],
        AllUserDocs: [],
        numTasks: {
            Waiting: {
                All: 0,
                First: 0
            },
            Opening: {
                All: 0,
                First: 0
            },
            Doing: {
                All: 0,
                First: 0
            },
            COMPLETED: {
                All: 0,
                First: 0
            }
        },
        Events: {
            currentEventIndex: 0,
            EventsArray: []
        },
        accordionContainer: {
            clientHeight: [],
            returnedHeight: 0
        }
    },

    Lists: {
        Reminders: {
            HE: "תזכורות",
            EN: "Reminders"
        },
        MyTasks: {
            HE: "מעקב משימות"
        }
    },

    TasksStatus: {
        DOING: {
            Text: 'מתבצע',
            Color: 'yellow'
        },
        OPEN: {
            Text: 'לא התחילה',
            Color: 'green',
        },
        WAITING: {
            Text: 'ממתין למישהו אחר',
            Color: 'red'
        },
        COMPLETED: {
            Text: 'הושלם',
            Color: 'blue'
        },
        REJECTED: {
            Text: 'נדחה',
            Color: 'null'
        }
    }
}

const initAccordiion = async(a) => {
    const accordionContainer = document.getElementsByClassName("accordion__container");
    for (let accordion of accordionContainer) {
        personalDataObject.GlobalVariables.accordionContainer.returnedHeight += accordion.clientHeight
        personalDataObject.GlobalVariables.accordionContainer.clientHeight.push(accordion.clientHeight);
    }
    const acc = document.getElementsByClassName("accordion");
    let i;
    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
                this.parentElement.style.maxHeight = "initial";
            } else {
                let active = document.querySelectorAll(".active");
                //Close all panels
                for (let j = 0; j < active.length; j++) {
                    active[j].classList.remove("active");
                    active[j].nextElementSibling.style.maxHeight = null;
                }
                const max = calcRemainHeight();
                panel.style.maxHeight = `${max}px`; //panel.scrollHeight + "px";
            }
            this.classList.toggle("active");
        });
    }
}

const calcRemainHeight = () => {
    let containerHeight = document.getElementById("personalarea__container").clientHeight;
    const max = (containerHeight - personalDataObject.GlobalVariables.accordionContainer.returnedHeight);
    return max;
}

const overwriteCss = () => {
    let main = document.getElementById("main");
    let personalAreaContainer = document.getElementById("personalarea__container");
    let personalDataContainer = document.getElementById("personalData__container");
    let containerWidth = personalAreaContainer.clientWidth;
    let containerHeight = personalAreaContainer.clientHeight;
    main.style.maxHeight = `${containerHeight}px`;
    personalAreaContainer.style.maxHeight = `${containerHeight}px`;
    personalDataContainer.style.width = `${containerWidth}px`;
    personalDataContainer.style.maxHeight = `${containerHeight}px`;
}

const initPersonalData = async() => {
    //CSS realTime changes
    overwriteCss();
    initAccordiion();

    try {
        console.log(`${new Date()} : call initPersonalData at personalData.js`);
        //initEvents();
        //initTasks();
        //initDocs();
    } catch (error) {
        console.error(error);
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
    }
}

initPersonalData();