# GreenPower

## Description: 
GreenPower is a power consumption calculator that can be used to measure the average powe consumption of a single program running on a Windows system in Watts(W) . The power consumption is measured based on the Thermal Design Power of the Central Processing Unit of the system and the CPU usage of that program ( Formula: CPU Usage / tdp * 100).


## Information:

This is an experimental program written by Edgar Snow for the technical assessment as part of the internship application for Greenie Web, a ClimateTech startup. It is a command-line application that shows a list of running processes where users can select a process to track the CPU power consumption of. 

- Langauge: JavaScript 
- Libraries Used: google-it, child_process, os, readline
- Run Time: Node.js

## How it works:

1. It first gathers information about the CPU model and CPU cores of the system. Next, it googles the TDP of it using the CPU model. 
2. Afterwards, it allows users to enter keywords or a search query to search for a desired process. A list of filtered processes is returned if the user enters keywords / search query. If the user skip the searching phase, a full list of all running processes are returned. 
3. The list can be navigated by the user to select a desired process and by pressing 'Enter' or 'Return' key, they can measure its power consumption. 
4. The program will start a timer to count the duration of the measurement and display the CPU Usage, Power Consumption per sec and average Power Consumption. 

**IT IS RECOMMENDED TO LET THE PROGRAM RUN FOR AT LEAST 5 MINUTES IN ORDER TO GET ACCURATE AVERAGE POWER CONSUMPTION PER SEC.**

5. Afterwards, the program can be stopped by entering 'Ctrl + C' or 'Esc/Escape' keys. Based on the average power returned, the program will tell if the power consumption is high (>=70W), normal(>=40W) or low(<30WW).


## Notice and Known Issues
As it is a program written in 3 days by a tired and stressed student, there are bound to be many limitations and bugs. Here are a list of known bugs and limitations:
- Filtered List returns 'ghost' processes after the filteredProcesses, resulting in user being able to move more downwards and outside the screen of the shown list. 
- List is not rendered before a search command and search command cannot be changed once inputted (This feature will be modified to allow List to be rendered before searching and allow search results to be live instead of being inputted once)
- Google-It module has any limitations and sometime TDP informaiton may be false. Hence, the default TDP might be used in most cases (65W).
- Google-It results display if the machine running the program is not fast enough which might result in users being confused. However, the results go away once the TDP can be determined. 
- Many more bugs and limitations are bound to show up.


## Installation 
After downloading the repository, install the necessary dependencies by running the following command

```
npm install
```
- In some cases, the modules might not be installed correctly. Run these commands if they are not being installed:
```
npm install os, google-it, readline, child_process
```

## Usage
Run the program by using the terminal and navigating to the directory of where the **app.js** file is located:
```
node .
```
or 
```
node app.js
```

After the program starts, you can either search for a process using its name (e.g. if you want to search for chrome, enter "chrome") or skip the search by pressing the ``'Enter/Return'`` key. Afterwards, you can select a process that you want to track from the list by navigating through it using the ``'UP' and 'Down' arrowkeys``.

## Documentation
### Functions

- **searchCPU(cpuModel)**: a function that takes in a cpuModel string and returns the TDP (Thermal Design Power) of the CPU. It uses the google-it package to search for the TDP of the CPU on the internet.

- **clearConsole()**: a function that clears the console screen and resets the cursor to the top-left corner of the screen.

- **printProcesses(searchQuery)**: a function that prints a list of running processes to the console screen. It takes in an optional searchQuery string that filters the list of processes by the given search query.

- **startCpuUsageTracking()**: a function that tracks the CPU usage of the selected process and estimates its power consumption in real-time. It uses the wmic command to retrieve the CPU usage of the selected process and the TDP of the CPU to estimate its power consumption.

### Variables

- **readline**: the readline module from the Node.js standard library. It is used to read user input from the console.

- **os**: the os module from the Node.js standard library. It is used to retrieve information about the system's CPU, such as the CPU model and number of cores.

- **execSync**: a function from the child_process module that is used to execute shell commands synchronously.

- **search**: the google-it package, which is used to search the internet for information about the CPU's TDP.

- **rl**: a readline.Interface instance that is used to read user input from the console.

- **processes**: an array of objects that represents the running processes on the system. Each object contains information such as the process ID, memory usage, and executable path.

- **startIndex**: an integer that represents the starting index of the list of processes to display on the console screen.

- **selectedIndex**: an integer that represents the index of the currently selected process in the list of processes.

- **lastKnownPowerConsumption**: a float that represents the last known power consumption of the selected process.

- **cpuUsageInterval**: an interval that tracks the CPU usage of the selected process and estimates its power consumption in real-time.

- **cpuModel**: a string that represents the CPU model of the system.

- **cpuCores**: an integer that represents the number of CPU cores on the system.

- **filteredProcesses**: an array of objects that represents the filtered list of processes based on the search query. Each object contains information such as the process ID, memory usage, and executable path
