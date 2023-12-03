var quill;

function get(selector) {
  let els = document.querySelectorAll(selector);
  return els;
}

window.addEventListener('DOMContentLoaded', (event) => {

  let note_mode = 0;

  const loadAllNotes = function () {

    fetch('https://api.rau.lol/notes/get_all_notes')
      .then(response => response.json())
      .then(data => {

        if (!data.result) return;
        
        get('#notesList')[0].innerHTML = '';
        data.result.forEach(note => {
          get('#notesList')[0].innerHTML += (`
          <li title="${note.name}">
            <a href="?nid=${note.id}" class="note-link" data-id="${note.id}">${note.name}</a>
          </li>
        `);
        });
      });
  }
  
  const setParams = function (id) {
    // let params = new URLSearchParams(window.location.search);
    // params.set('id', id);
    // window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }

  const save = function () {
    if (note_mode == 0) method = 'create';
    else method = 'update';

    let title = get('#name')[0].innerHTML;
    if (title == '') {
      e.preventDefault();
      alert('Title cannot be empty');
    }

    var params = new URLSearchParams();
    params.append("name", title);
    params.append("content", quill.root.innerHTML);
    params.append("adminkey", "test")

    fetch(`https://api.rau.lol/notes/${method}`, {
      method: "POST",
      body: params
    })
    .then(function (res) {
      return res.json();
    })
    .then(function (data2) {
      alert(JSON.stringify(data2));
      loadAllNotes();
    });
  }

  const loadNote = function (params) {

    // params = '';
    // if (id)
    //   params = `nid=${id}`;
    // else if (name)
    //   params = `name=${name}`
    // else
    //   return;

    if (params.length == 0) return;

    return fetch(`https://api.rau.lol/notes/get?${params}`)
      .then(response => {
        if (response.headers.get('Content-Type').includes('application/json')) {
          return response.json(); // Return the JSON response
        } else {
          return response.text(); // Return the response as text
        }

      })
      .then(data => {
        
        if (params.includes('raw')) {
          document.write(data);
          return;
        }
        else if (!data.result) return;

        get('#name')[0].innerHTML = data.result.name

        content = data.result.content;

        // content = quill.clipboard.convert(content);        
        // quill.setContents(content, 'silent');
        
        // overrite all content if 'raw' is in the url
        quill.root.innerHTML = content;

        setParams(data.result.id);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(function () {
        console.log('complete', params);
        // get('#save')[0].innerHTML = 'Update';
        note_mode = 1;
      });
  }

  const loadNoteFromParams = function () {
    let params = new URLSearchParams(window.location.search);

    loadNote(params.toString());
  }

  // get('#save')[0].addEventListener('click', function (e) {

  //   save();

  // });


  // get('#name')[0].addEventListener('input', function () {
  //   if(this.innerHTML == '') this.innerHTML = 'Untitled';
  //   console.log(this.innerHTML)
  // });


  function loadQuill() {
    quill = new Quill("#editor", {
      modules: {
        toolbar: [
          [{ "font": [] }, { "size": ["small", false, "large", "huge"] }], // custom dropdown

          ["bold", "italic", "underline", "strike"],

          [{ "color": [] }, { "background": [] }],

          [{ "script": "sub" }, { "script": "super" }],

          [{ "header": 1 }, { "header": 2 }, "blockquote", "code-block"],

          [{ "list": "ordered" }, { "list": "bullet" }, { "indent": "-1" }, { "indent": "+1" }],

          [{ "direction": "rtl" }, { "align": [] }],

          ["link", "image", "video", "formula"],

          ["clean"],
        ]
      },
      theme: "snow"
    });

    let quill_toolbar = document.querySelector(".ql-toolbar.ql-snow");
    document.querySelector(".container").prepend(quill_toolbar);

    // Save button toolbar option
    let saveSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" style="fill: #3e8e41;" viewBox="0 0 48 48">
      <path d="M0 0h48v48h-48z" fill="none"/>
      <path d="M34 6h-24c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4v-24l-8-8zm-10 32c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm6-20h-20v-8h20v8z"/>
    </svg>
    `
    let customGroup = document.createElement("span");
    let saveBtn = document.createElement("button");

    customGroup.classList.add("ql-formats");
    saveBtn.classList.add("ql-save");

    saveBtn.title = "Save Note";
    saveBtn.innerHTML = saveSVG;
    saveBtn.addEventListener("click", function () {
      // alert('save');
      save();
    });

    customGroup.appendChild(saveBtn);

    // Options button toolbar option
    let optionsSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
      <path d="M0 0h48v48h-48z" fill="none"/>
      <path d="M38.86 25.95c.08-.64.14-1.29.14-1.95s-.06-1.31-.14-1.95l4.23-3.31c.38-.3.49-.84.24-1.28l-4-6.93c-.25-.43-.77-.61-1.22-.43l-4.98 2.01c-1.03-.79-2.16-1.46-3.38-1.97l-.75-5.3c-.09-.47-.5-.84-1-.84h-8c-.5 0-.91.37-.99.84l-.75 5.3c-1.22.51-2.35 1.17-3.38 1.97l-4.98-2.01c-.45-.17-.97 0-1.22.43l-4 6.93c-.25.43-.14.97.24 1.28l4.22 3.31c-.08.64-.14 1.29-.14 1.95s.06 1.31.14 1.95l-4.22 3.31c-.38.3-.49.84-.24 1.28l4 6.93c.25.43.77.61 1.22.43l4.98-2.01c1.03.79 2.16 1.46 3.38 1.97l.75 5.3c.08.47.49.84.99.84h8c.5 0 .91-.37.99-.84l.75-5.3c1.22-.51 2.35-1.17 3.38-1.97l4.98 2.01c.45.17.97 0 1.22-.43l4-6.93c.25-.43.14-.97-.24-1.28l-4.22-3.31zm-14.86 5.05c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
    </svg>
    `
    let optionsBtn = document.createElement("button");

    customGroup.classList.add("ql-formats");
    optionsBtn.classList.add("ql-options");

    optionsBtn.title = "Options";
    optionsBtn.innerHTML = optionsSVG;
    optionsBtn.addEventListener("click", function () {
      alert('options');
    });

    customGroup.appendChild(optionsBtn);

    quill_toolbar.appendChild(customGroup);
  }

  loadQuill();
  // loadAllNotes();
  loadNoteFromParams();


});
