%% Load Data
charadeData = readtable("charades_summary_.xlsx"); 

x1 = charadeData.x1;
y1 = charadeData.y1;
ori1 = charadeData.ori1;

x2 = charadeData.x2;
y2 = charadeData.y2;
ori2 = charadeData.ori2;

trialNum = height(charadeData);

%% Scaling