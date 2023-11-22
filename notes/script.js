function get(selector) {
    let els = document.querySelectorAll(selector);
    return (els.length == 1) ? els[0] : els;
}
class Note {
    constructor(id, name, title, content) {
        this.id = id;
        this.name = name;
        this.title = title;
        this.content = content;
    }
}

class Notes {
    constructor() {
        this.currentNote = new Note();
    }

    newNote() {
        document.getElementById('title').innerText = '';
        get('.pell-content').innerHTML = '';
        this.currentNote = null;
    }

    saveNote() {
        // Save the content currently in pell-content
        // If the title is empty, prompt for a title
        // If the title is not empty, save the note
        let newNote = false;
        let title = get('#title').innerText;
        if (!title) {
            this.currentNote.title = prompt('Please enter a title for this note');
            newNote = true;
        }

        if (newNote) {
            document.getElementById('title').innerText = title;
            fetch('https://rau.dev/api/zk/add',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: notes.currentNote.title,
                        data: notes.currentNote.content
                    })
                }).then(function (response) {
                    return response.json();
                }).then(data => {
                    if (data.result) {
                        notes.updateList();
                        alert('Note created!');
                        this.currentNote = new Note(
                            data.result.key,
                            data.result.name,
                            data.result.title,
                            data.result.content
                        );
                        get('#title').innerText = data.result.title;
                    }
                    else {
                        alert('Error creating note');
                    }
                });
        }
        else {
            fetch('https://rau.dev/api/zk/update',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        // key: this.currentNote.id,
                        title: this.currentNote.title,
                        data: this.currentNote.content
                    })
                }).then(function (response) {
                    return response.json();
                }).then(function (data) {
                    console.log(data);
                    alert('Note saved!');
                });
        }
    }

    noteOptions() {

    }

    updateList() {
        let _this = this;
        // Load list of notes
        fetch('https://rau.dev/api/zk/list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            var notes = get('#notes #links');
            notes.innerHTML = '';
            data.result.forEach(function (note) {
                var noteDiv = document.createElement('div');
                var noteA = document.createElement('a');
                noteA.setAttribute('href', '#');
                noteA.setAttribute('data-id', note);
                noteA.setAttribute('data-name', note);
                noteA.setAttribute('data-title', note);

                noteA.innerHTML = note;
                noteDiv.appendChild(noteA);
                notes.appendChild(noteDiv);
                let title = note;
                noteA.addEventListener('click', function (e) {
                    fetch(`https://rau.dev/api/zk/get?title=${note}`, { //this.getAttribute('data-title')}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function (response) {
                        return response.json();
                    }).then(function (data) {

                        document.getElementById('title').innerText = title;
                        get('.pell-content').innerHTML = data.result;
                        _this.currentNote = new Note(
                            data.result.id,
                            data.result.name,
                            data.result.title,
                            data.result.content
                        );
                    });
                });
            });
        });
    }
}

var notes = new Notes();
notes.updateList();

var saveAction = {
    name: 'save',
    icon: '&#x1F4BE;',
    title: 'Save',
    result: function () {
        notes.saveNote();
    }
};

var optionsAction = {
    name: 'options',
    icon: '&#9881;&#65039;',
    title: 'Options',
    result: function () {
        if (!notes.currentNote) return;
        let oModal = get('#omodal');
        if (!oModal) return;
        if (oModal.style.display != "block") {
            oModal.style.display = "block";
        } else {
            oModal.style.display = "none";
        }
    }
};
var editor = document.getElementById('editor');
pell.init({
    element: editor,
    onChange: function (html) {
        // get('.pell-content').innerHTML = html;
        // check if the title has changed from the currentNote title
        let title = get('#title').innerText;
        if (notes.currentNote && notes.currentNote.title && title != notes.currentNote.title) {
            // update the title in the list
            get('#title').innerText = notes.currentNote.title;
        }

        notes.currentNote.content = html;
    },
    actions: [
        ...pell.actions,
        saveAction,
        optionsAction
    ]
});

get('#newnotebutton').addEventListener('click', function (e) {
    notes.newNote();
});

get('.close').addEventListener('click', function () {
    let oModal = get('#omodal');
    if (!oModal) return;
    oModal.style.display = "none";
});

get('#rename-input').addEventListener('input', function () {
    let link = this.value;
    let search_results = get('#search-results')[0];
    if (link == '') {
        search_results.innerHTML = '';
        return;
    }
});