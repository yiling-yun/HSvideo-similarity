%% SCREEN SETUP
clc;
close all;
clear all;

PsychDebugWindowConfiguration;

PsychDefaultSetup(2);
Screen('Preference', 'VisualDebugLevel', 1) ; % suppress Psychtoolbox welcome screen
Screen('Preference', 'SkipSyncTests', 2);
screenNumber     = max(Screen('Screens'));
[w, windowRect]  = PsychImaging('OpenWindow', screenNumber, [0 0 0], [], [], [], [], 5);
[wWidth,wHeight] = Screen('WindowSize', w);    
xmid             = round(wWidth  / 2);         
ymid             = round(wHeight / 2);   

Screen('BlendFunction', w, 'GL_SRC_ALPHA', 'GL_ONE_MINUS_SRC_ALPHA'); %YY

textColor        = [1 1 1];
textWarningColor = [1 0 0];
practiceDotC     = [1, 1, 1;
    0.9, 0.9, 0.9;
    0.8, 0.8, 0.8;
    0.7, 0.7, 0.7;
    0.6, 0.6, 0.6];


%% LOAD DATA FILE
charadeData = readtable("charades_summary_.xlsx"); 

x1Data = charadeData.x1;
y1Data = charadeData.y1;
ori1Data = charadeData.ori1;

x2Data = charadeData.x2;
y2Data = charadeData.y2;
ori2Data = charadeData.ori2;

trialNum = height(charadeData);

%% INTRODUCTION
DrawFormattedText(w, ['Welcome to the experiment!' ...
    '\n\nIn the experiment, you will see animations of two triangles.' ...
    '\nYour task is to detect whether a grey dot appeared on either triangle during each trial.' ...
    '\nPress space bar as soon as you see the grey dot.' ...
    '\n\nYou will complete 5 practice trials before proceeding to the actual experiment.' ...
    '\n\nPress space bar to continue.'], 'center', 'center', textColor);
Screen('Flip', w) ;                           
WaitSecs(5);
Screen('Flip', w) ;     

%% PRACTICE TRIAL
trialNum = 10;
practiceTrialNum = 5;

for p = 1: practiceTrialNum
    x1 = x1Data(p+trialNum); x1 = x1{1};
    x1 = strrep(x1, '[', ''); x1 = strrep(x1, ']', ''); x1 = strrep(x1, '''', ''); 
    x1 = str2double(strsplit(x1, ','));

    y1 = y1Data(p+trialNum); y1 = y1{1};
    y1 = strrep(y1, '[', ''); y1 = strrep(y1, ']', ''); y1 = strrep(y1, '''', '');
    y1 = str2double(strsplit(y1, ','));

    ori1 = ori1Data(p+trialNum); ori1 = ori1{1};
    ori1 = strrep(ori1, '[', ''); ori1 = strrep(ori1, ']', ''); ori1 = strrep(ori1, '''', '');
    ori1 = str2double(strsplit(ori1, ','));

    x2 = x2Data(p+trialNum); x2 = x2{1};
    x2 = strrep(x2, '[', ''); x2 = strrep(x2, ']', ''); x2 = strrep(x2, '''', '');
    x2 = str2double(strsplit(x2, ','));

    y2 = y2Data(p+trialNum); y2 = y2{1};
    y2 = strrep(y2, '[', ''); y2 = strrep(y2, ']', ''); y2 = strrep(y2, '''', '');
    y2 = str2double(strsplit(y2, ','));

    ori2 = ori2Data(p+trialNum); ori2 = ori2{1};
    ori2 = strrep(ori2, '[', ''); ori2 = strrep(ori2, ']', ''); ori2 = strrep(ori2, '''', '');
    ori2 = str2double(strsplit(ori2, ','));

    for i = 1:numel(ori1)-1
        t1Orientation(i) = ori1(i+1)-ori1(i);
        t2Orientation(i) = ori2(i+1)-ori2(i);
    end

    scale = 10;
    canvasWO = 4000;
    canvasHO = 3000;
    canvasW = canvasWO /scale;
    canvasH = canvasW * (3/4);
    canvasR = [xmid-canvasW, ymid-canvasH, xmid+canvasW, ymid+canvasH];

    x1Coord = x1;
    y1Coord = y1;
    x2Coord = x2;
    y2Coord = y2;

    x1Coord = (x1Coord./scale).*2.+canvasR(1);
    y1Coord = ((y1Coord./scale).*2.-canvasR(4)).*(-1);

    x2Coord = (x2Coord/scale)*2+canvasR(1);
    y2Coord = ((y2Coord/scale)*2-canvasR(4))*(-1);

    sideL = 80;        % Length of each side

    x   = [x1Coord', (x1Coord - sideL / 2)', (x1Coord + sideL / 2)']; % x11 = [triangleX, triangleX - sideL / 2, triangleX + sideL / 2];
    y   = [(y1Coord - (sqrt(3) / 4) * sideL)', (y1Coord + (sqrt(3) / 4) * sideL)', (y1Coord + (sqrt(3) / 4)*sideL)']; % y11 = [triangleY - (sqrt(3) / 4) * sideL, triangleY + (sqrt(3) / 4) * sideL, triangleY + (sqrt(3) / 4)*sideL];

    x2  = [x2Coord', (x2Coord - sideL / 2)', (x2Coord + sideL / 2)']; % x11 = [triangleX, triangleX - sideL / 2, triangleX + sideL / 2];
    y2  = [(y2Coord - (sqrt(3) / 4) * sideL)', (y2Coord + (sqrt(3) / 4) * sideL)', (y2Coord + (sqrt(3) / 4)*sideL)']; % y11 = [triangleY - (sqrt(3) / 4) * sideL, triangleY + (sqrt(3) / 4) * sideL, triangleY + (sqrt(3) / 4)*sideL];


    tx1 = [];
    ty1 = [];
    tx2 = [];
    ty2 = [];

for i = 1:(numel(x1Coord))-1
    tx1 = [tx1 ; (x(i,1) - x1Coord(i)) * cos(t1Orientation(i)) - (y(i,1) - y1Coord(i)) * sin(t1Orientation(i)) + x1Coord(i), ...
       (x(i,2) - x1Coord(i)) * cos(t1Orientation(i)) - (y(i,2) - y1Coord(i)) * sin(t1Orientation(i)) + x1Coord(i), ...
       (x(i,3) - x1Coord(i)) * cos(t1Orientation(i)) - (y(i,3) - y1Coord(i)) * sin(t1Orientation(i)) + x1Coord(i)];

    ty1 = [ty1; (x(i,1) - x1Coord(i)) * sin(t1Orientation(i)) + (y(i,1) - y1Coord(i)) * cos(t1Orientation(i)) + y1Coord(i), ...
       (x(i,2) - x1Coord(i)) * sin(t1Orientation(i)) + (y(i,2) - y1Coord(i)) * cos(t1Orientation(i)) + y1Coord(i), ...
       (x(i,3) - x1Coord(i)) * sin(t1Orientation(i)) + (y(i,3) - y1Coord(i)) * cos(t1Orientation(i)) + y1Coord(i)];

    tx2 = [tx2; (x2(i,1) - x2Coord(i)) * cos(t2Orientation(i)) - (y2(i,1) - y2Coord(i)) * sin(t2Orientation(i)) + x2Coord(i), ...
       (x2(i,2) - x2Coord(i)) * cos(t2Orientation(i)) - (y2(i,2) - y2Coord(i)) * sin(t2Orientation(i)) + x2Coord(i), ...
       (x2(i,3) - x2Coord(i)) * cos(t2Orientation(i)) - (y2(i,3) - y2Coord(i)) * sin(t2Orientation(i)) + x2Coord(i)];

    ty2 = [ty2; (x2(i,1) - x2Coord(i)) * sin(t2Orientation(i)) + (y2(i,1) - y2Coord(i)) * cos(t2Orientation(i)) + y2Coord(i), ...
       (x2(i,2) - x2Coord(i)) * sin(t2Orientation(i)) + (y2(i,2) - y2Coord(i)) * cos(t2Orientation(i)) + y2Coord(i), ...
       (x2(i,3) - x2Coord(i)) * sin(t2Orientation(i)) + (y2(i,3) - y2Coord(i)) * cos(t2Orientation(i)) + y2Coord(i)];
end


dotFrame = 10;
dotStartFrame = int32(rand() * numel(x1Coord) - dotFrame);
dotT = int32(rand() * 1); ; % triangle 1
dotC = practiceDotC(p,:); % color
dotS = 3; % size
dotStartTime = 0;
dotEndTime = 0;
t = 0;
keyIsDown = 0;

keyPressed = false;
hitTime = 1.5; % secs after probe onset (data analysis)



for i = 1:(numel(x1Coord)-1)
    Screen('FillRect', w, 1, canvasR);

    Screen('FillPoly', w, 0.5, ([tx1(i,:); ty1(i,:)])');
    Screen('FillPoly', w, 0.5, ([tx2(i,:); ty2(i,:)])');

    % Present dot on triangle
    if (i >= dotStartFrame && i < (dotStartFrame + dotFrame))
        if (dotT == 1)
            Screen('DrawDots', w, [(tx1(i,1) + tx1(i,2)+tx1(i,2) + tx1(i,3)+tx1(i,3) + tx1(i,1))/6, (ty1(i,1) + ty1(i,2)+ty1(i,2) + ty1(i,3)+ty1(i,3) + ty1(i,1))/6], dotS, dotC);
        else
            Screen('DrawDots', w, [(tx2(i,1) + tx2(i,2)+tx2(i,2) + tx2(i,3)+tx2(i,3) + tx2(i,1))/6, (ty2(i,1) + ty2(i,2)+ty2(i,2) + ty2(i,3)+ty2(i,3) + ty2(i,1))/6], dotS, dotC);
        end
    end

    if (i == dotStartFrame)
        dotStartTime = GetSecs;
    end

    if (i == dotStartFrame + dotFrame)
        dotEndTime = GetSecs;
    end

    frameDuration = (dotEndTime - dotStartTime)/10;

    Screen('Flip', w);
end

Screen('Flip', w);
WaitSecs(2);
end


%% PROCEED TO EXPERIMENT
DrawFormattedText(w, ['Now you have completed the practice trials,' ...
    '\n\nPress space bar to proceed to the actual experiment.'], 'center', 'center', textColor);
Screen('Flip', w) ;                           
WaitSecs(3);
Screen('Flip', w) ;     

%% CONVERTING NUMERIC VALUE
for i = 1:trialNum

x1 = x1Data(i); x1 = x1{1};
x1 = strrep(x1, '[', ''); x1 = strrep(x1, ']', ''); x1 = strrep(x1, '''', ''); 
x1 = str2double(strsplit(x1, ','));

y1 = y1Data(i); y1 = y1{1};
y1 = strrep(y1, '[', ''); y1 = strrep(y1, ']', ''); y1 = strrep(y1, '''', '');
y1 = str2double(strsplit(y1, ','));

ori1 = ori1Data(i); ori1 = ori1{1};
ori1 = strrep(ori1, '[', ''); ori1 = strrep(ori1, ']', ''); ori1 = strrep(ori1, '''', '');
ori1 = str2double(strsplit(ori1, ','));

x2 = x2Data(i); x2 = x2{1};
x2 = strrep(x2, '[', ''); x2 = strrep(x2, ']', ''); x2 = strrep(x2, '''', '');
x2 = str2double(strsplit(x2, ','));

y2 = y2Data(i); y2 = y2{1};
y2 = strrep(y2, '[', ''); y2 = strrep(y2, ']', ''); y2 = strrep(y2, '''', '');
y2 = str2double(strsplit(y2, ','));

ori2 = ori2Data(i); ori2 = ori2{1};
ori2 = strrep(ori2, '[', ''); ori2 = strrep(ori2, ']', ''); ori2 = strrep(ori2, '''', '');
ori2 = str2double(strsplit(ori2, ','));

for i = 1:numel(ori1)-1
    t1Orientation(i) = ori1(i+1)-ori1(i);
    t2Orientation(i) = ori2(i+1)-ori2(i);
end

% v = {x1}
% v = v{1}

%% Scaling
scale = 10;
canvasWO = 4000;
canvasHO = 3000;
canvasW = canvasWO /scale;
canvasH = canvasW * (3/4);
canvasR = [xmid-canvasW, ymid-canvasH, xmid+canvasW, ymid+canvasH];

x1Coord = x1;
y1Coord = y1;
x2Coord = x2;
y2Coord = y2;

x1Coord = (x1Coord./scale).*2.+canvasR(1);
y1Coord = ((y1Coord./scale).*2.-canvasR(4)).*(-1);

x2Coord = (x2Coord/scale)*2+canvasR(1);
y2Coord = ((y2Coord/scale)*2-canvasR(4))*(-1);

sideL = 80;        % Length of each side

x   = [x1Coord', (x1Coord - sideL / 2)', (x1Coord + sideL / 2)']; % x11 = [triangleX, triangleX - sideL / 2, triangleX + sideL / 2];
y   = [(y1Coord - (sqrt(3) / 4) * sideL)', (y1Coord + (sqrt(3) / 4) * sideL)', (y1Coord + (sqrt(3) / 4)*sideL)']; % y11 = [triangleY - (sqrt(3) / 4) * sideL, triangleY + (sqrt(3) / 4) * sideL, triangleY + (sqrt(3) / 4)*sideL];

x2  = [x2Coord', (x2Coord - sideL / 2)', (x2Coord + sideL / 2)']; % x11 = [triangleX, triangleX - sideL / 2, triangleX + sideL / 2];
y2  = [(y2Coord - (sqrt(3) / 4) * sideL)', (y2Coord + (sqrt(3) / 4) * sideL)', (y2Coord + (sqrt(3) / 4)*sideL)']; % y11 = [triangleY - (sqrt(3) / 4) * sideL, triangleY + (sqrt(3) / 4) * sideL, triangleY + (sqrt(3) / 4)*sideL];

%% TRIANGLE COORDINATE CALCULATION
tx1 = [];
ty1 = [];
tx2 = [];
ty2 = [];

for i = 1:(numel(x1Coord))-1
    tx1 = [tx1 ; (x(i,1) - x1Coord(i)) * cos(t1Orientation(i)) - (y(i,1) - y1Coord(i)) * sin(t1Orientation(i)) + x1Coord(i), ...
       (x(i,2) - x1Coord(i)) * cos(t1Orientation(i)) - (y(i,2) - y1Coord(i)) * sin(t1Orientation(i)) + x1Coord(i), ...
       (x(i,3) - x1Coord(i)) * cos(t1Orientation(i)) - (y(i,3) - y1Coord(i)) * sin(t1Orientation(i)) + x1Coord(i)];

    ty1 = [ty1; (x(i,1) - x1Coord(i)) * sin(t1Orientation(i)) + (y(i,1) - y1Coord(i)) * cos(t1Orientation(i)) + y1Coord(i), ...
       (x(i,2) - x1Coord(i)) * sin(t1Orientation(i)) + (y(i,2) - y1Coord(i)) * cos(t1Orientation(i)) + y1Coord(i), ...
       (x(i,3) - x1Coord(i)) * sin(t1Orientation(i)) + (y(i,3) - y1Coord(i)) * cos(t1Orientation(i)) + y1Coord(i)];

    tx2 = [tx2; (x2(i,1) - x2Coord(i)) * cos(t2Orientation(i)) - (y2(i,1) - y2Coord(i)) * sin(t2Orientation(i)) + x2Coord(i), ...
       (x2(i,2) - x2Coord(i)) * cos(t2Orientation(i)) - (y2(i,2) - y2Coord(i)) * sin(t2Orientation(i)) + x2Coord(i), ...
       (x2(i,3) - x2Coord(i)) * cos(t2Orientation(i)) - (y2(i,3) - y2Coord(i)) * sin(t2Orientation(i)) + x2Coord(i)];

    ty2 = [ty2; (x2(i,1) - x2Coord(i)) * sin(t2Orientation(i)) + (y2(i,1) - y2Coord(i)) * cos(t2Orientation(i)) + y2Coord(i), ...
       (x2(i,2) - x2Coord(i)) * sin(t2Orientation(i)) + (y2(i,2) - y2Coord(i)) * cos(t2Orientation(i)) + y2Coord(i), ...
       (x2(i,3) - x2Coord(i)) * sin(t2Orientation(i)) + (y2(i,3) - y2Coord(i)) * cos(t2Orientation(i)) + y2Coord(i)];
end

%% DOT
% Screen('DrawDots', w, dotPosition, dotSize, dotColor, [], 2);
dotFrame = 10;
dotStartFrame = int32(rand() * numel(x1Coord) - dotFrame);
dotT = int32(rand() * 1); ; % triangle 1
dotC = 0.6;%[50, 50, 50]; % color
dotS = 3; % size
dotStartTime = 0;
dotEndTime = 0;
t = 0;
keyIsDown = 0;

keyPressed = false;
hitTime = 1.5; % secs after probe onset (data analysis)



%% EXPERIMENT
for i = 1:(numel(x1Coord)-1)
    Screen('FillRect', w, 1, canvasR);

    Screen('FillPoly', w, 0.5, ([tx1(i,:); ty1(i,:)])');
    Screen('FillPoly', w, 0.5, ([tx2(i,:); ty2(i,:)])');

    % Present dot on triangle
    if (i >= dotStartFrame && i < (dotStartFrame + dotFrame))
        if (dotT == 1)
            Screen('DrawDots', w, [(tx1(i,1) + tx1(i,2)+tx1(i,2) + tx1(i,3)+tx1(i,3) + tx1(i,1))/6, (ty1(i,1) + ty1(i,2)+ty1(i,2) + ty1(i,3)+ty1(i,3) + ty1(i,1))/6], dotS, dotC);
        else
            Screen('DrawDots', w, [(tx2(i,1) + tx2(i,2)+tx2(i,2) + tx2(i,3)+tx2(i,3) + tx2(i,1))/6, (ty2(i,1) + ty2(i,2)+ty2(i,2) + ty2(i,3)+ty2(i,3) + ty2(i,1))/6], dotS, dotC);
        end
    end

    if (i == dotStartFrame)
        dotStartTime = GetSecs;
    end

    if (i == dotStartFrame + dotFrame)
        dotEndTime = GetSecs;
    end

    frameDuration = (dotEndTime - dotStartTime)/10;

    Screen('Flip', w);
end

Screen('Flip', w);
WaitSecs(2);


end

% survey questions: purpose of study; strategies used; gender; age
% data: reaction time; subject number; trial number; probe location; probe
% time; accuracy

