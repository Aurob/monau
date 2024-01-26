/*
    Recreation of musical notation using Web Audio API
    https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
    --------------------------------------------------------------
    Robert Aucoin
    version 0.1
    -------------

    NOTES AND TODO
    --------------
      Bass clef is 2 octaves and 2 notes below treble clef
       or simply, down 2 note names
        i.e F -> A, G -> B, A -> C, B -> D, C -> E, D -> F, E -> G
      TODO - implement key signatures
*/

//TODO STAFF rename
// The staff is what holds the notes in place
// a measure is a group of notes on the staff

//TODO Use ChannelMerger ! https://stackoverflow.com/a/59362152
//TODO Use AudioWorkletNode https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletNode
//TODO Use AudioWorkletProcessor https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor
//TODO Use AudioWorklet https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet
//TODO Use AudioWorkletGlobalScope https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletGlobalScope

var music_utils = new MusicUtils();

class Composition {   
    oscillators = {};
    playing = false;
    properties = {};
    constructor(measure_groups, notation_properties) {
        if(!measure_groups || !Array.isArray(measure_groups)) throw new Error('Composition must have at least 1 measure group');
        if(!measure_groups.length || !measure_groups[0] instanceof(Note)) throw new Error('Measure group must have at least 1 Note');
        for(let i = 0; i < measure_groups.length; i++) {
            if(!measure_groups[i] instanceof(MeasureGroup)) throw new Error('Measure Group must be an instance of MeasureGroup');
        }

        this.measure_groups = measure_groups;

        //console.log(this.properties, notation_properties)
        this.properties = JSON.parse(notation_properties);
    } 

    play() {
        // new Promise((res, rej) => {
            if(!this.properties.loop && this.playing) this.stop();
            this.playing = true;
            for(let i = 0; i < this.measure_groups.length; i++) {
                let measure_group = this.measure_groups[i];
                let delay = 0;//i * this.properties.time_signature[0] * 60 / this.properties.tempo;
                measure_group.play(delay, i)
                // .then(() => {
                //     if(i == this.measure_groups.length - 1) 
                //         res();
                // });
            }
        // })
        // .then(()=> {
        //     if(this.properties.loop) this.play();
        // })
    }

    stop() {
        
        this.playing = false;
        this.measure_groups.forEach(mgroup => {
            mgroup.stop(mgroup.oscillator_id);
        });
    }
}

class MeasureGroup {

    constructor(notes, notation, properties) {

        //TODO
        // notes shouldn't have to be required. 
        // It may be useful to be able to create empty measure groups that notes can be added to later.
        if(!notes) throw new Error('No notes provided');
        else {
            if(!notes.length) throw new Error('No notes provided');
        }

        this.notes = notes;

        if(!notation) throw new Error('No notation provided');
        else {
            if(!notation.time_signature) throw new Error('No time signature provided');
            if(!notation.tempo) throw new Error('No tempo provided');
        }

        this.notation = notation;
        this.properties = properties;

    }

    play(delay, m) {

        return new Promise(async (res, rej) => {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.audioCtx.tempo = this.notation.tempo;
            this.audioCtx.delay = delay;
            
            let loop = 1;
            while(loop < 2) {
                for (let i = 0; i < this.notes.length; i++) {
                    let note = this.notes[i];
                    let note_element = $(`#_${m}-${i}`);
                    note_element.css('background-color', 'red');
                    if(Object.keys(this.notation).includes('key_signature')) {
                        note.transpose(this.notation.key_signature);
                    }

                    await note.play(this.audioCtx)
                    .then(()=> {
                        note_element.css('background-color', 'white');
                    })
                }
                loop += (this.properties.loop) ? 0 : 1;
                // console.log(this.properties.loop, loop, 1234)
            }
        });
    
    }

    stop(oscillator_id) {
        this.notes.forEach(note => {
            note.stop(oscillator_id);
            let note_element = $(`#_${oscillator_id}`);
            note_element.css('background-color', 'white');
        });
        this.audioCtx.close();
    }
}

class Note {
    constructor(type, note, octave, force_natural, sound_type) {
        if(!type) throw new Error('No type provided');
        if(note == undefined) throw new Error('No pitch provided');
        if(!octave) throw new Error('No octave provided');

        this.type = type;
        this.note = note;
        this.key_note = note;
        this.octave = octave;
        this.force_natural = force_natural;
        this.sound_type = sound_type;
    }

    async play(audioCtx) {
        // console.log(audioCtx.delay, ((60000/audioCtx.tempo) * note_types[this.type] * 4));
        return music_utils.play_oscillator(audioCtx, 
            notes[this.note] * this.octave,  
            audioCtx.delay + ((60000/audioCtx.tempo) * note_types[this.type] * 4), 
            this.sound_type
        );

    }

    stop(oscillator_id) {
        music_utils.stop_oscillator(oscillator_id);
    }

    transpose(key_signature) {
        for(let key of key_signature) {
            if(!this.force_natural && this.note == key_signature_options[key]) {
                this.note = key;
            }
        }
    }
}
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));