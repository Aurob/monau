let url_params = new URLSearchParams(window.location.search);
let music_param = url_params.get('music');
let alt_music_param = url_params.get('m');
let song = music_param || alt_music_param;
var c1;

//Load Songs in header
//populate the subjects array
fetch(`songs.txt?${Math.random()}`)
.then(res => res.text())
.then(data => {
    console.log(data);
    data.split('\n').forEach(link => {
        $('#song-list').append(`
            <div class='flex-item'>
                <a class='link' href='/' music_title='${link}'>${link.split('.')[0]}</a>
            </div>
        `);
    });
})
.then(events => {
    $('.link').on('click', function(e) {
        //console.log(this);
        e.preventDefault();

        // set the url search params to the selected song
        let song = this.getAttribute('music_title');
        let url = new URL(window.location.href.split('?')[0]);
        url.searchParams.set('music', song);
        window.location.href = url;
    });
});

if (song) {
    let url = `sheets/${song}.yml?${Math.random()}`;
    console.log(url)
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'text/yaml',
        }
    })
        .then(res => res.text())
        .then(yaml => jsyaml.load(yaml))
        .then(data => {
            // console.log(data)
            let mgroups = [];
            let notations = [];
            let measure_groups = data.measure_groups;
            let properties = data.properties;
            //console.log(data);
            for (instrument of Object.keys(measure_groups)) {
                //console.log(instrument)
                if (!measure_groups[instrument]) continue;
                mgroups.push(measure_groups[instrument].notes);
                let notation = {
                    'time_signature': properties.time_signature,
                    'tempo': properties.tempo,
                    'key_signature': measure_groups[instrument].key_signature || [],
                    'sound_type': measure_groups[instrument].sound_type || '',
                }

                notations.push(notation);
            }

            if (mgroups) {
                localStorage.setItem('properties', JSON.stringify(properties));
                localStorage.setItem('measure_groups', mgroups);
                $('#load').append(`<button id="loadbtn" class="btn btn-primary">Load</button>`)

                $('#loadbtn').on('click', () => {
                    $('#actions').empty();
                    $('#measure_groups').empty();

                    let Measure_Groups = [];
                    let mgroups = localStorage.getItem('measure_groups').split(',');
                    $('#actions').append(`Tempo: <input type='number' id='tempo' value='${properties.tempo}' placeholder='Tempo' />`);
                    for (let mg = 0; mg < mgroups.length; mg++) {
                        let mgroup = mgroups[mg].replace('\n', '');
                        let Notes = [];
                        
                        let note_elements = [];
                        //console.log(mgroup)
                        for (let nn = 0; nn < mgroup.split(' ').length; nn++) {
                            let n = mgroup.split(' ')[nn];
                            let notation = n.split('.');
                            let type = notation[0];
                            let note = notation[1];
                            let octave = notation[2] || 1;
                            let sound_type = notations[mg].sound_type;
                            console.log(sound_type)
                            let force_natural = false;
                            if(note.includes('♮')) {
                                note = note.split('♮')[0];
                                force_natural = true;
                            }
                            if (notes[note] == undefined) continue;
                            //console.log(notation, note, notes[note]);
                            let N = new Note(type, note, octave, force_natural, sound_type);
                            Notes.push(N);

                            note_elements.push(`<div id='_${mg}-${nn}' class='note'>${n}</div>`);
                        }

                        //console.log(Notes)
                        m = new MeasureGroup(Notes, notations[mg], properties);
                        Measure_Groups.push(m);
                        let measure_group_notes = document.createElement('div');
                        measure_group_notes.classList.add('measure_group_notes');
                        measure_group_notes.innerHTML = note_elements.join('');

                        //create a textarea for this measure group and append it to the measure groups element
                        let textarea = document.createElement('div');
                        // textarea.contentEditable = true;
                        // textarea.innerText = mgroup;
                        textarea.id = `measure_group_${Measure_Groups.length - 1}`;
                        textarea.className = 'measure_group';
                        textarea.append(`${Object.keys(measure_groups)[mg]}`);
                        textarea.append(measure_group_notes)
                        $('#measure_groups').append(textarea);
                    }

                    let playbutton = $(`<button id='play'>Play Composition</button>`);
                    $('#actions').append(playbutton);

                    playbutton.on('click', async () => {
                        let notation;
                        if(!$('#stop').length) {
                            let stopbutton = $(`<button id='stop'>Stop Composition</button>`);
                            $('#actions').append(stopbutton);
                            stopbutton.on('click', () => {
                                c1.stop();
                                $('#stop').remove();
                            });
                        }
                        let MeasureGroups = [];
                        let mgroups = localStorage.getItem('measure_groups').split(',');
                        for (let i = 0; i < mgroups.length; i++) {
                            let measure_group = mgroups[i];
                            let Notes = [];
                            for (let n of measure_group.split(' ')) {
                                // console.log(n);
                                let nn = n.split('.');
                                let type = nn[0];
                                let note = nn[1];
                                let octave = nn[2] || 1;
                                let force_natural = false;
                                if(note.includes('♮')) {
                                    note = note.split('♮')[0];
                                    force_natural = true;
                                }
                                if (notes[note] == undefined) continue;
                                //console.log(notation, note, notes[note]);
                                // console.log(octave)
                                let N = new Note(type, note, octave, force_natural, notations[i].sound_type);
                                Notes.push(N);

                                //TODO store each note in its own element
                                // reference the note by measure index and note index
                            }
                            let m = new MeasureGroup(Notes, notations[i], properties);
                            MeasureGroups.push(m);
                        }

                        let c1 = new Composition(MeasureGroups, localStorage.getItem('properties'));

                        c1.play(true);
                        
                    })
                });
            }
        });
}

