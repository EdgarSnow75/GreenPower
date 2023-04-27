// This line imports the readline module, which provides an interface for reading input from a stream.
const readline = require('readline');

// This line imports the os module, which provides a way of interacting with the operating system.
const os = require('os');

// This line imports the execSync function from the child_process modul`e, which allows synchronous execution of a command in a shell.
const { execSync } = require('child_process');

// This line imports the google-it module, which allows searching on Google.
const search = require('google-it');

// This creates an interface for reading input from the command line.
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});

// An empty array to store the running processes.
let processes = [];

// The index of the first process to display in the list.
let startIndex = 0;

// The index of the currently selected process.
let selectedIndex = 0;

// The last known power consumption of the selected process.
let lastKnownPowerConsumption = 0;

// A variable to hold the setInterval reference for CPU usage tracking.
let cpuUsageInterval;

// Get the CPU model and number of cores.
const cpuModel = os.cpus()[0].model;
const cpuCores = os.cpus().length / 2;

// This function searches Google for the TDP of the CPU model.
async function searchCPU(cpuModel) {

    // The search query.
    const query = `TDP of ${cpuModel}`.trim();

    // A regular expression to match the TDP in the search results.
    const tdpRegex = /(\d+)W/;

    try {
        // Search for the query and wait for the results.
        const results = await search({ query });
        let tdp = "unknown";

        // Loop through the search results and find the TDP.
        for (let i = 0; i < results.length; i++) {
            const tdpMatch = results[i].snippet.match(tdpRegex);

            // If the TDP is found, return it and clear the console.
            if (tdpMatch) {
                tdp = parseInt(tdpMatch[1]);
                console.clear();
                return tdp;
            }

            // If the TDP is not found in any of the search results, default to 65.
            if (i === results.length - 1) {
                tdp = 65;
            }
        }

        return tdp;
    } catch (err) {
        console.error(err);
    }
}

// Display a message and fetch the list of running processes.
console.log('Welcome to GreenPower!');
console.log('Fetching list of running processes...');
const taskListOutput = execSync('tasklist /fo csv /nh').toString();
console.log('Done fetching list of running processes.');

// Parse the list of running processes and store them in the processes array.
processes = taskListOutput
    .split('\r\n')
    .filter(line => line.trim())
    .map(line => {
        const [imageName, pid, sessionName, sessionNumber, memoryUsage, executablePath] = line.split('","').map(s => s.replace(/"/g, ''));
        const name = executablePath ? executablePath.split('\\').pop() : '';
        return { imageName, name, pid, sessionName, sessionNumber, memoryUsage };
    });

// Clear the console and move the cursor to the top-left corner
function clearConsole() {
    console.clear();
    readline.cursorTo(rl.output, 0, 0);
    readline.clearScreenDown(rl.output);
}

// Print the list of running processes to the console
function printProcesses(searchQuery = '') {
    clearConsole();
    console.log('GreenPower');
    console.log('Build: 0.0.1');
    console.log(`CPU Model: ${cpuModel} \nCPU Cores: ${cpuCores}`);
    console.log(`Search: ${searchQuery}`);
    console.log('List of running processes:\n');
    console.log("   Image Name                         PID     Session Name    Session Number  MemUsage");
    console.log("------------------------------------------------------------------------------------------");

    filteredProcesses = searchQuery !== ''
        ? processes.filter(p => p.imageName.toLowerCase().includes(searchQuery.toLowerCase()))
        : processes;
    for (let i = startIndex; i < Math.min(startIndex + 18, filteredProcesses.length); i++) {
        const process = filteredProcesses[i];
        const isSelected = i === selectedIndex;
        const prefix = isSelected ? '-> ' : '   ';
        console.log(`${prefix}${process.imageName.padEnd(35)}${process.pid.toString().padEnd(8)}${process.sessionName.padEnd(16)}${process.sessionNumber.toString().padEnd(16)}${process.memoryUsage}`);
    }
}

//Track the CPU usage of the selected process and calculate the power consumption and average power consumption per sec using it
async function startCpuUsageTracking() {
    const selectedProcess = filteredProcesses[selectedIndex];
    const tdp = await searchCPU(cpuModel) || 65;
    const startTime = new Date();
    let duration = 0;
    let totalPowerConsumption = 0;
    const cpuUsageCommand = `wmic path Win32_PerfFormattedData_PerfProc_Process where "IDProcess=${selectedProcess.pid}" get PercentProcessorTime`;
    cpuUsageInterval = setInterval(() => {
        try {
            const output = execSync(cpuUsageCommand).toString();
            const cpuUsage = parseFloat(output.trim().split('\r\n')[1]);
            const powerConsumption = parseFloat(cpuUsage) * tdp / 100;
            duration = Math.round((new Date() - startTime) / 1000);
            totalPowerConsumption += powerConsumption;
            const avgPowerConsumption = totalPowerConsumption / duration;
            clearConsole();
            console.log('GreenPower');
            console.log('Build: 0.0.1');
            console.log(`CPU Model: ${cpuModel} \nCPU Cores: ${cpuCores}`);
            console.log(`TDP is: ${tdp}\n`);
            console.log(`Selected Process: ${selectedProcess.imageName}`);
            console.log(`PID: ${selectedProcess.pid}\n`);
            console.log('Duration'.padEnd(60), 'CPU Usage'.padEnd(20), 'Power Consumption'.padEnd(30), 'Avg Power Consumption');
            console.log(`${duration} sec`.padEnd(60), `${cpuUsage.toFixed(2)}%`.padEnd(20), `${powerConsumption.toFixed(2)}W`.padEnd(30), `${avgPowerConsumption.toFixed(2)}W/s`);
            lastKnownPowerConsumption = avgPowerConsumption;
            console.log(`\n`);
            console.log('It is recommended that you run the program for at least 5 mins in order to get the accurate average power consumption per second');
            console.log(`\n`);
            console.log('Press the "Esc or Escape" key to quit stop the tracking');

        } catch (error) {
            console.error(error);
        }
    }, 1000);
}

//Readlines to allow users to input search queries and arrow keys to navigate the list
rl.question('Enter search query (press enter to skip): ', (searchQuery) => {
    printProcesses(searchQuery);

    rl.input.setRawMode(true);
    rl.input.on('keypress', (_, key) => {
        if (key.name === 'c' && key.ctrl) {
            rl.close();
            process.exit();
        } else if (key.name === 'up' && selectedIndex > startIndex) {

            selectedIndex--;
            if (selectedIndex === startIndex + 4 && startIndex > 0) {
                startIndex--;
                printProcesses(searchQuery);
            }
            printProcesses(searchQuery);
        } else if (key.name === 'down' && selectedIndex < processes.length - 1) {
            selectedIndex++;
            if (selectedIndex === startIndex + 10 && startIndex + 10 < processes.length) {
                startIndex++;
                printProcesses(searchQuery);
            }
            printProcesses(searchQuery);
        } else if (key.name === 'return') {
            const selectedProcess = filteredProcesses[selectedIndex];
            console.log(`Starting CPU usage tracking for process '${selectedProcess.imageName}'(PID: ${selectedProcess.pid})`);
            clearInterval(cpuUsageInterval);
            startCpuUsageTracking();
        } else if (key.name === 'escape') {
            clearInterval(cpuUsageInterval);
            console.log(`Average Power Consumption: ${lastKnownPowerConsumption.toFixed(2)}W`);
            if (lastKnownPowerConsumption >= 70) {
                console.log('Power Consumption is High');
            } else if (lastKnownPowerConsumption >= 40) {
                console.log('Power Consumption is Normal');
            } else {
                console.log('Power Consumption is Low');
            }
            console.log('Exiting process monitor...');
            if (cpuUsageInterval) {
                clearInterval(cpuUsageInterval);
            }
            rl.close();
            process.exit();
        }
    });

});

