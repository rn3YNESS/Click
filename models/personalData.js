export const personalDataObject = {
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