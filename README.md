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
