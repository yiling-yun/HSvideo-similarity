let VIDEOS_TABLE;
// Fetch CSV file and process data
//will have columns id / label / agent 

function fetchVideoData(test) {
    fetch('stim/video_id_list.csv')
    .then(response => response.text())
    .then(data => {
        const parsedData = parseCSV(data);
        VIDEOS_TABLE = shuffleRows(parsedData);
        test.trialInput = VIDEOS_TABLE.slice(0,9); //.slice(0,9) to limit video # for testing
        test.trialN = test.trialInput.length;
        // Access specific data by: 
        //console.log(VIDEOS_TABLE[0].label);
        buffer_video($('#bufferVid1')[0], test.stimSource + test.trialInput[test.trialIndex].agent +'/' + test.trialInput[test.trialIndex].id +'_' + test.trialInput[test.trialIndex].label + test.stimType);
    })
    .catch(error => console.error('Error loading the CSV file:', error)); 
}
// Function to parse CSV data into array of objects
function parseCSV(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim().replace(/\r$/, '');
        const values = line.split(',');
        if (values.length === headers.length) {
            const obj = {};
            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = values[j];
            }
            data.push(obj);
        }
    }

    return data;
}
// Function to shuffle the rows of an array
function shuffleRows(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

