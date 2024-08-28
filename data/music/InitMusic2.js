// Dynamic Composition Creator

// Create main container
const compositionCreator = document.createElement('div');
compositionCreator.id = 'composition-creator';
document.body.appendChild(compositionCreator);

// Create YAML editor
const yamlEditor = document.createElement('textarea');
yamlEditor.id = 'yaml-editor';
yamlEditor.rows = 20;
yamlEditor.cols = 80;
yamlEditor.placeholder = 'Enter your YAML composition here...';
compositionCreator.appendChild(yamlEditor);

// Create control panel
const controlPanel = document.createElement('div');
controlPanel.id = 'control-panel';
compositionCreator.appendChild(controlPanel);

// Add buttons
const loadButton = document.createElement('button');
loadButton.textContent = 'Load Composition';
controlPanel.appendChild(loadButton);

const playButton = document.createElement('button');
playButton.textContent = 'Play';
controlPanel.appendChild(playButton);

const stopButton = document.createElement('button');
stopButton.textContent = 'Stop';
controlPanel.appendChild(stopButton);

// Add tempo control
const tempoControl = document.createElement('input');
tempoControl.type = 'number';
tempoControl.id = 'tempo-control';
tempoControl.min = 60;
tempoControl.max = 240;
tempoControl.value = 120;
tempoControl.step = 1;
controlPanel.appendChild(tempoControl);

const tempoLabel = document.createElement('label');
tempoLabel.htmlFor = 'tempo-control';
tempoLabel.textContent = 'Tempo: ';
controlPanel.insertBefore(tempoLabel, tempoControl);

// Create visualization area
const visualizationArea = document.createElement('div');
visualizationArea.id = 'visualization-area';
compositionCreator.appendChild(visualizationArea);

// Event Listeners
loadButton.addEventListener('click', () => {
    try {
        const composition = jsyaml.load(yamlEditor.value);
        visualizeComposition(composition);
    } catch (error) {
        alert('Invalid YAML. Please check your composition.');
    }
});

playButton.addEventListener('click', () => {
    const composition = jsyaml.load(yamlEditor.value);
    playComposition(composition);
});

stopButton.addEventListener('click', () => {
    // Implement stop functionality
});

// Helper functions
function visualizeComposition(composition) {
    visualizationArea.innerHTML = '';
    for (const [instrument, part] of Object.entries(composition.measure_groups)) {
        console.log(instrument, part);
        const instrumentDiv = document.createElement('div');
        instrumentDiv.className = 'instrument-part';
        instrumentDiv.innerHTML = `<h3>${instrument}</h3><p>${part.notes}</p>`;
        visualizationArea.appendChild(instrumentDiv);
    }
}

function playComposition(composition) {
    // Implement playback using Web Audio API
    // This is a placeholder for the actual implementation
    console.log('Playing composition:', composition);
}

// Load a default composition
yamlEditor.value = `properties:
  time_signature: "4/4"
  tempo: 120
  loop: true

measure_groups:
  melody:
    sound_type: synth_lead
    notes:
      4.c.4 4.e.4 4.g.4 4.c.5
      4.d.4 4.f.4 4.a.4 4.d.5

  bass:
    sound_type: electric_bass
    notes:
      2.c.3 2.g.3
      2.d.3 2.a.3`;

// Initial visualization
visualizeComposition(jsyaml.load(yamlEditor.value));
