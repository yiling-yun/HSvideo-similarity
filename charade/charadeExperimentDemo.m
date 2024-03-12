%% SCREEN SETUP
clc;
close all;
clear all;

% PsychDebugWindowConfiguration;
HideCursor;

PsychDefaultSetup(2);
Screen('Preference', 'VisualDebugLevel', 1) ; % suppress Psychtoolbox welcome screen
Screen('Preference', 'SkipSyncTests', 2);
screenNumber     = max(Screen('Screens'));
[w, windowRect]  = PsychImaging('OpenWindow', screenNumber, [0 0 0], [], [], [], [], 5);
[wWidth,wHeight] = Screen('WindowSize', w);    
xmid             = round(wWidth  / 2);         
ymid             = round(wHeight / 2);   

Screen('BlendFunction', w, 'GL_SRC_ALPHA', 'GL_ONE_MINUS_SRC_ALPHA'); %YY
Screen ('TextSize', w, 25);


%% KEY SETUP
KbName('UnifyKeyNames');
keyNumSpace = min(KbName('space'));
keyCode = zeros(1,256);


%% COLOR SETUP
textColor        = [1 1 1];
screenColor      = [0 0 0];
textWarningColor = [1 0 0];
triangleColor    = 0.5;
probeColor       = 0.6;
practiceDotC     = [1, 1, 1;
    0.9, 0.9, 0.9;
    0.8, 0.8, 0.8;
    0.7, 0.7, 0.7;
    0.6, 0.6, 0.6];


%% LOAD DATA FILE
charadeLabel = readtable("charades_label.xlsx"); 
charadeData = readtable("charades_summary_.xlsx"); 

videoID  = charadeLabel.id;
probeID  = charadeLabel.probeId;

x1Data   = charadeData.x1;
y1Data   = charadeData.y1;
ori1Data = charadeData.ori1;

x2Data   = charadeData.x2;
y2Data   = charadeData.y2;
ori2Data = charadeData.ori2;

trialNum = height(charadeData)-5-1;
practiceTrialNum = 5; % height(charadeData);

% data to be saved
reactionT = {};
probeStart  = {};
accurateHit = ones(1, practiceTrialNum+trialNum);
probePosition = {};


%% SUBJECT ID
subjIDPromptDimRect = Screen('TextBounds', w, 'Enter subject id: ') ;                % rect for ID prompt
subjIDWidth   = subjIDPromptDimRect(3);        % width for ID prompt
subjIDHeight  = subjIDPromptDimRect(4);        % height for ID prompt
xSubjIDPrompt = xmid - subjIDWidth /2;         % x coordinate of ID
ySubjIDPrompt = ymid - subjIDHeight/2;         % y coordinate of ID

subjectID = GetEchoString(w, 'Enter subject id: ', xSubjIDPrompt, ySubjIDPrompt, [1 1 1], [0 0 0]);

Screen('FillRect', w, [0 0 0]);
Screen('Flip', w);
WaitSecs(0.5);

%% INTRODUCTION
DrawFormattedText(w, ['Welcome to the experiment!' ...
    '\n\nIn the experiment, you will see animations of two triangles.' ...
    '\nYour task is to detect whether a grey dot appeared on either triangle during each trial.' ...
    '\nPress space bar as soon as you see the grey dot.' ...
    '\n\nPress space bar to proceed.'], 'center', 'center', textColor);
Screen('Flip', w) ;  

RestrictKeysForKbCheck(keyNumSpace);           % diregard all keys except space
[~, keyCode]  = KbWait(-1)          ;          % wait for key-press
Screen('Flip', w) ; 
WaitSecs(0.5);

%% PRACTICE TRIAL
DrawFormattedText(w, ['In the following section,' ...
    '\nyou will complete 5 trials before the actual experiment.' ...
    '\nA false alarm will show up if you fail to detect the probe' ...
    '\nor if you did not respond immediately.' ...
    '\n\nPress space bar to begin.'], 'center', 'center', textColor);
Screen('Flip', w) ;  
RestrictKeysForKbCheck(keyNumSpace);           % diregard all keys except space
[~, keyCode]  = KbWait(-1)          ;          % wait for key-press
WaitSecs(0.5);
 

%% CONVERTING NUMERIC VALUE
for i = 1:(practiceTrialNum + trialNum)

    if i == (practiceTrialNum + 1)
        DrawFormattedText(w, ['Now you have completed the practice trial.' ...
            '\nThe experiment is similar to the practice section with more trials' ...
            '\n\nWhen you are ready,' ...
            '\nPress space bar to proceed to the experiment.' ...
            ''], 'center', 'center', textColor);
        Screen('Flip', w) ; 
        RestrictKeysForKbCheck(keyNumSpace);           % diregard all keys except space
        [~, keyCode]  = KbWait(-1)          ;          % wait for key-press
        WaitSecs(0.5);
    end

    r = find(charadeData.id == videoID(i)); % role index of the item
    
    x1 = x1Data(r); x1 = x1{1};
    x1 = strrep(x1, '[', ''); x1 = strrep(x1, ']', ''); x1 = strrep(x1, '''', ''); 
    x1 = str2double(strsplit(x1, ','));

    y1 = y1Data(r); y1 = y1{1};
    y1 = strrep(y1, '[', ''); y1 = strrep(y1, ']', ''); y1 = strrep(y1, '''', '');
    y1 = str2double(strsplit(y1, ','));

    ori1 = ori1Data(r); ori1 = ori1{1};
    ori1 = strrep(ori1, '[', ''); ori1 = strrep(ori1, ']', ''); ori1 = strrep(ori1, '''', '');
    ori1 = str2double(strsplit(ori1, ','));

    x2 = x2Data(r); x2 = x2{1};
    x2 = strrep(x2, '[', ''); x2 = strrep(x2, ']', ''); x2 = strrep(x2, '''', '');
    x2 = str2double(strsplit(x2, ','));

    y2 = y2Data(r); y2 = y2{1};
    y2 = strrep(y2, '[', ''); y2 = strrep(y2, ']', ''); y2 = strrep(y2, '''', '');
    y2 = str2double(strsplit(y2, ','));

    ori2 = ori2Data(r); ori2 = ori2{1};
    ori2 = strrep(ori2, '[', ''); ori2 = strrep(ori2, ']', ''); ori2 = strrep(ori2, '''', '');
    ori2 = str2double(strsplit(ori2, ','));

    for i = 1:numel(ori1)-1
        t1Orientation(i) = ori1(i+1)-ori1(i);
        t2Orientation(i) = ori2(i+1)-ori2(i);
    end


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

for j = 1:(numel(x1Coord))-1
    tx1 = [tx1 ; (x(j,1) - x1Coord(j)) * cos(t1Orientation(j)) - (y(j,1) - y1Coord(j)) * sin(t1Orientation(j)) + x1Coord(j), ...
       (x(j,2) - x1Coord(j)) * cos(t1Orientation(j)) - (y(j,2) - y1Coord(j)) * sin(t1Orientation(j)) + x1Coord(j), ...
       (x(j,3) - x1Coord(j)) * cos(t1Orientation(j)) - (y(j,3) - y1Coord(j)) * sin(t1Orientation(j)) + x1Coord(j)];

    ty1 = [ty1; (x(j,1) - x1Coord(j)) * sin(t1Orientation(j)) + (y(j,1) - y1Coord(j)) * cos(t1Orientation(j)) + y1Coord(j), ...
       (x(j,2) - x1Coord(j)) * sin(t1Orientation(j)) + (y(j,2) - y1Coord(j)) * cos(t1Orientation(j)) + y1Coord(j), ...
       (x(j,3) - x1Coord(j)) * sin(t1Orientation(j)) + (y(j,3) - y1Coord(j)) * cos(t1Orientation(j)) + y1Coord(j)];

    tx2 = [tx2; (x2(j,1) - x2Coord(j)) * cos(t2Orientation(j)) - (y2(j,1) - y2Coord(j)) * sin(t2Orientation(j)) + x2Coord(j), ...
       (x2(j,2) - x2Coord(j)) * cos(t2Orientation(j)) - (y2(j,2) - y2Coord(j)) * sin(t2Orientation(j)) + x2Coord(j), ...
       (x2(j,3) - x2Coord(j)) * cos(t2Orientation(j)) - (y2(j,3) - y2Coord(j)) * sin(t2Orientation(j)) + x2Coord(j)];

    ty2 = [ty2; (x2(j,1) - x2Coord(j)) * sin(t2Orientation(j)) + (y2(j,1) - y2Coord(j)) * cos(t2Orientation(j)) + y2Coord(j), ...
       (x2(j,2) - x2Coord(j)) * sin(t2Orientation(j)) + (y2(j,2) - y2Coord(j)) * cos(t2Orientation(j)) + y2Coord(j), ...
       (x2(j,3) - x2Coord(j)) * sin(t2Orientation(j)) + (y2(j,3) - y2Coord(j)) * cos(t2Orientation(j)) + y2Coord(j)];
end


%% DOT INFO
% Screen('DrawDots', w, dotPosition, dotSize, dotColor, [], 2);
dotFrame = 10;  % 300 ms
dotStartFrame = int32(rand() * numel(x1Coord) - dotFrame - 30) + 30;
dotT = probeID(i); ;    % triangle 1
dotC = 0.6;     %[50, 50, 50]; 
dotS = 20;      % size
dotStartTime = 0;
dotEndTime = 0;
t = 0;

keyIsDown = 0;
keyPressed = false;
hitTime = 1.5; % secs after probe onset (data analysis)


%% EXPERIMENT
for k = 1:(numel(x1Coord)-1)
    Screen('FillRect', w, 1, canvasR);

    Screen('FillPoly', w, triangleColor, ([tx1(k,:); ty1(k,:)])');
    Screen('FillPoly', w, triangleColor, ([tx2(k,:); ty2(k,:)])');

    % Present dot on triangle
    if (k >= dotStartFrame && k < (dotStartFrame + dotFrame))
        if (dotT == 1)
            Screen('DrawDots', w, [(tx1(k,1) + tx1(k,2)+tx1(k,2) + tx1(k,3)+tx1(k,3) + tx1(k,1))/6, (ty1(k,1) + ty1(k,2)+ty1(k,2) + ty1(k,3)+ty1(k,3) + ty1(k,1))/6], dotS, dotC);
        else
            Screen('DrawDots', w, [(tx2(k,1) + tx2(k,2)+tx2(k,2) + tx2(k,3)+tx2(k,3) + tx2(k,1))/6, (ty2(k,1) + ty2(k,2)+ty2(k,2) + ty2(k,3)+ty2(k,3) + ty2(k,1))/6], dotS, dotC);
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

    RestrictKeysForKbCheck([keyNumSpace]);
    [keyIsDown, secs, keyCode] = KbCheck;
    if keyCode(keyNumSpace)
        if (secs-dotStartTime>hitTime || dotStartTime == 0) % rt longer than hit time or before dot
            Screen('FillRect', w, screenColor);
            DrawFormattedText(w, 'You made a false alarm', 'center', ymid, textWarningColor);    % display instruction on screen
            Screen('Flip', w);
            accurateHit(i) = 0;
            WaitSecs(2);
            break;
        end

        if (keyPressed == false)
            t = secs - dotStartTime; % reaction time
        end

        keyCode = zeros(1,256);
        keyPressed = true;
    end

end
reactionT = [reactionT, t];
probeStart = [probeStart, dotStartFrame]
probePosition = [probePosition, dotT];

Screen('Flip', w);
WaitSecs(2);


end

%% ENDING PROMPT
DrawFormattedText(w, ['Thank you for your participation!' ...
    '\n\nYou will be directed to complete a short survey.' ...
    '\nPlease let the experimenter know when you have submitted the survey.' ...
    '\n\nPress space bar to proceed.'], 'center', 'center', textColor);
Screen('Flip', w) ; 

RestrictKeysForKbCheck(keyNumSpace);           % diregard all keys except space
[~, keyCode]  = KbWait(-1)         ;           % wait for key-press


%% END & DATA SAVING
filename = strcat('subject', subjectID, 'data.xlsx');
date     = datetime(t,'ConvertFrom','datenum');
save(['subj' subjectID],'date', 'subjectID', 'reactionT', 'videoID', 'accurateHit', 'probeStart', 'probePosition');

sca;
url = 'https://docs.google.com/forms/d/e/1FAIpQLSeKTJxDR47oSdhBPKOaJlfrs4BQ2nykBpNv9Ce2QmmS3TIQDg/viewform?usp=sf_link';
web(url, '-browser');

