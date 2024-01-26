//https://ourcodeworld.com/articles/read/1627/how-to-easily-generate-a-beep-notification-sound-with-javascript

// The browser will limit the number of concurrent audio contexts
// So be sure to re-use them whenever you can
const myAudioContext = new AudioContext();

/**
 * Helper function to emit a beep sound in the browser using the Web Audio API.
 * 
 * @param {number} duration - The duration of the beep sound in milliseconds.
 * @param {number} frequency - The frequency of the beep sound.
 * @param {number} volume - The volume of the beep sound.
 * 
 * @returns {Promise} - A promise that resolves when the beep sound is finished.
 */
function beep(audioCtx, duration, frequency, volume, type){
    return new Promise((resolve, reject) => {
        // Set default duration if not provided
        duration = duration || 200;
        frequency = frequency;
        volume = volume || 100;

        try{
            let oscillatorNode = audioCtx.createOscillator();
            let gainNode = audioCtx.createGain();
            oscillatorNode.connect(gainNode);
            
            if(type == 'percussion') {
                // Set the oscillator frequency for a percussion sound
                oscillatorNode.frequency.value = 55; // Set frequency for 'A1' bass sound
                oscillatorNode.type = 'triangle'; // Triangle wave for a softer bass sound

                const envelope = audioCtx.createGain();
                oscillatorNode.connect(envelope);
                envelope.connect(audioCtx.destination);

                // Custom ADSR envelope to simulate a drum sound
                // Attack: Quick increase to max volume
                envelope.gain.setValueAtTime(0.001, audioCtx.currentTime);
                envelope.gain.linearRampToValueAtTime(volume * 0.5, audioCtx.currentTime + 0.01);
                // Decay: Drop to 0 over the duration to simulate a drum hit fading out
                envelope.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration * 0.001);

                oscillatorNode.start(audioCtx.currentTime);
                // Stop the oscillator after the specified duration
                oscillatorNode.stop(audioCtx.currentTime + duration * 0.001);
            }
            else {
                // Set the oscillator frequency in hertz
                oscillatorNode.frequency.value = frequency;

                // Set the type of oscillator to simulate the pluck of a harpsichord
                oscillatorNode.type = "square";

                // Connect the gain node to the audio context's destination
                gainNode.connect(audioCtx.destination);

                // Set the initial gain to the volume and create a fade out effect
                // to simulate the resounding aura of a chime
                gainNode.gain.setValueAtTime(volume * 0.01, audioCtx.currentTime);
                // gainNode.gain.exponentialRampToValueAtTime(volume * 0.005, audioCtx.currentTime + duration * 0.25 * 0.001);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration * 0.001);

                
                // Start audio with the desired duration
                oscillatorNode.start(audioCtx.currentTime);
                oscillatorNode.stop(audioCtx.currentTime + duration * 0.001);

            }
            
            // Resolve the promise when the sound is finished
            oscillatorNode.onended = () => {
                gainNode.disconnect(); // Disconnect the gain node to clean up
                resolve();
            };
        }catch(error){
            reject(error);
        }
    });
}

function beep2(duration, frequency, volume){
    return new Promise((resolve, reject) => {
        // Set default duration if not provided
        duration = duration || 200;
        frequency = frequency || 440;
        volume = volume || 100;

        try{
            let oscillatorNode = myAudioContext.createOscillator();
            let gainNode = myAudioContext.createGain();
            oscillatorNode.connect(gainNode);

            // Set the oscillator frequency in hertz
            oscillatorNode.frequency.value = frequency;

            // Set the type of oscillator
            oscillatorNode.type= "square";
            gainNode.connect(myAudioContext.destination);

            // Set the gain to the volume
            gainNode.gain.value = volume * 0.01;

            // Start audio with the desired duration
            oscillatorNode.start(myAudioContext.currentTime);
            oscillatorNode.stop(myAudioContext.currentTime + duration * 0.001);

            // Resolve the promise when the sound is finished
            oscillatorNode.onended = () => {
                resolve();
            };
        }catch(error){
            reject(error);
        }
    });
}