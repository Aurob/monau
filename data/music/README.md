# Music Notation Web App

This web application allows users to create, load, and play musical compositions using a custom notation system. Here's a brief guide on how to use the app:

## Key Components

1. **MusicUtils.js**: Contains utility functions and constants for musical operations.
2. **MusicNotation.js**: Defines the core classes for musical elements (Composition, MeasureGroup, Note).
3. **InitMusic.js**: Handles the initialization and user interface of the application.
4. **YAML files (e.g., good1.yml, good3.yml)**: Store musical compositions in a structured format.

## How to Use

1. **Loading a Composition**:
   - Use the URL parameter `?music=filename` or `?m=filename` to load a specific YAML file.
   - Alternatively, select a song from the list in the sidebar.

2. **Playing a Composition**:
   - Click the "Load" button to parse the YAML file.
   - Adjust the tempo using the input field if desired.
   - Click "Play Composition" to start playback.
   - Use "Stop Composition" to halt playback.

3. **Composition Structure**:
   - Compositions are defined in YAML files with the following structure:
     - `properties`: Define time signature, tempo, and looping.
     - `measure_groups`: Contains instrument parts with notes.

4. **Note Notation**:
   - Notes are written as `type.note.octave` (e.g., `8.e.3` for an eighth note E in the 3rd octave).
   - Rests are denoted by `r` (e.g., `4.r` for a quarter rest).

5. **Customization**:
   - Modify YAML files to create new compositions.
   - Adjust sound types, tempos, and other properties in the YAML files.

## Advanced Features

- The app supports multiple instrument tracks per composition.
- Key signatures and transposition are supported.
- Various sound types can be specified for different instruments.

For developers looking to extend the application, refer to the comments and TODO items in the JavaScript files for potential improvements and feature additions.
