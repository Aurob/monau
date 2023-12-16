
// Letter notes and their base frequencies
//  'r' is used a a rest, it has a frequency of 0, so it makes not sound
var notes = {
    'r': 0,
    'a': 27.50,
    'a#': 29.14,
    'b♭': 29.14,
    'b': 30.87,
    'c': 32.70,
    'c#': 34.65,
    'd♭': 34.65,
    'd': 36.71,
    'd#': 38.89,
    'e♭': 38.89,
    'e': 41.20,
    'f': 43.65,
    'f#': 46.25,
    'g♭': 46.25,
    'g': 49.00,
    'g#': 51.91,
    'a♭': 51.91,
}

// note types are ratios of the measure
// 1 is a whole note, 1/2 is a half note, 1/4 is a quarter note, etc.
// TODO
//  'whole' note is really determined by the time signature
//      dynamically adjust a note types ratio to the measure
     
var note_types = {
    '1': 1,
    '2': .5,
    '4': .25,
    '8': .125,
    '16': .0625,
};

var note_type_names = {
    '1': 'whole',
    '2': 'half',
    '4': 'quarter',
    '8': 'eighth',
    '16': 'sixteenth',
}

var type_name_notes = {
    'whole': '1',
    'half': '2',
    'quarter': '4',
    'eighth': '8',
    'sixteenth': '16',
};


// key signature is additive
var key_signature_options = {
    'f#': 'f',
    'c#': 'c',
    'g#': 'g',
    'd#': 'd',
    'a#': 'a',
    'e#': 'e',
    'b#': {'b':'c'},
    'b♭': 'b',
    'e♭': 'e',
    'a♭': 'a',
    'd♭': 'd',
    'g♭': 'g',
    'f♭': {'f':'e'}
};

let transpose_offsets = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

let C_major_arpeggio = [
    notes["c"] * 2, notes["e"], notes["g"], notes["c"]
]

let D_major_arpeggio = [
    notes["d"] * 2, notes["f#"], notes["a"], notes["d"]
]

let E_major_arpeggio = [
    notes["e"] * 2, notes["g#"], notes["b"], notes["e"]
]

let F_major_arpeggio = [
    notes["f"] * 2, notes["a"], notes["c"], notes["f"]
]

const arpeggios = {
    "C_major_arpeggio": C_major_arpeggio,
    "D_major_arpeggio": D_major_arpeggio,
    "E_major_arpeggio": E_major_arpeggio,
    "F_major_arpeggio": F_major_arpeggio,

}


class MusicUtils {
    audioCtx;
    oscillators = {};

    constructor() {
    }

    new_oscillator() {
        let oscillator = {};

        oscillator.id = this.rand_id();
        oscillator.frequency = 440;
        oscillator.connected = false;
        this.oscillators[oscillator.id] = oscillator;

        return oscillator;
    }

    async play_oscillator(audioCtx, frequency, duration = 0) {
        console.log(duration, frequency);
        return beep(audioCtx, duration, frequency, 5);
    }

    delete_oscillator(oscillator) {
        oscillator.disconnect();
        oscillator.stop();

        delete this.oscillators[oscillator.id];
    }

    get_oscillator(id) {
        return this.oscillators[id];
    }

    rand_id() {
        return Math.random().toString(36).substr(2, 9); 
    }

    stop_oscillator(id) {
        
        for (let id_ in this.oscillators) {
            if(id == id_) {
                let oscillator = this.oscillators[id];
                oscillator.stop();
                oscillator.disconnect();
            }
        }
    }

    stop_all_oscillators() {
        for (let id in this.oscillators) {
            let oscillator = this.oscillators[id];
            oscillator.stop();
            oscillator.disconnect();
        }
    }


    transpose_bass_to_treble(treble_note) {
        let note_index = transpose_offsets.indexOf(treble_note);
        if(note_index > -1) {
            let transposition = note_index - 2;
            if(transposition < 0) transposition += transpose_offsets.length;
            return transpose_offsets[transposition];
        }
    }
    
    parse_notation(str) {
        let lines = str.trim().split('\n');
        let notation = '';
        for(let l = 0; l < lines.length; l++) {
            line = lines[l].trimLeft();
            notation += line + ' ';
        }
        return notation;
    }
    
    random_note() {
        let note = transpose_offsets[Math.floor(Math.random() * transpose_offsets.length)];
        let type = Object.keys(note_types)[Math.floor(Math.random() * Object.keys(note_types).length)];
        let octave = Math.floor(Math.random() * 3) + 3;
    
        return type + '.' + note + '.' + octave;
    }
}
