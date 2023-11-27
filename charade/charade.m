% ZZ
% Charade 
clc;
close all;
clear all;

PsychDebugWindowConfiguration;
% HideCursor;  % hide mouse cursor
rng shuffle;

%% SCREEN SETUP
PsychDefaultSetup(2);
Screen('Preference', 'VisualDebugLevel', 1);  % suppress Psychtoolbox welcome screen
Screen('Preference', 'SkipSyncTests', 1);     % skip sync testing that causes errors
screenNumber     = max(Screen('Screens'));
[w, windowRect]  = PsychImaging('OpenWindow', screenNumber, [0 0 0], [],[],[],[],5);
[wWidth,wHeight] = Screen('WindowSize', w);    
xmid             = round(wWidth  / 2);         
ymid             = round(wHeight / 2); 
Screen('TextSize', w, round(wHeight / 30));
screenColor      = [0 0 0];
textColor        = [1 1 1];
textWarningColor = [1 0 0];

Screen('BlendFunction', w, 'GL_SRC_ALPHA', 'GL_ONE_MINUS_SRC_ALPHA'); % anti-aliasing

KbName('UnifyKeyNames');                       
keyNumSpace = min(KbName('space'));
keyCode = zeros(1,256);     

reactionT = [];


%% CANVAS SCALING
% canvas scale
scale = 10;
canvasWO = 4000;
canvasHO = 3000;
canvasW = canvasWO /scale;
canvasH = canvasW * (3/4);
canvasR = [xmid-canvasW, ymid-canvasH, xmid+canvasW, ymid+canvasH];

sideL = 80;        % Length of each side

dotColor = [1, 1, 1;
    0.9, 0.9, 0.9;
    0.8, 0.8, 0.8;
    0.7, 0.7, 0.7;
    0.6, 0.6, 0.6];

%% INTRODUCTION
DrawFormattedText(w, ['Welcome to the experiment!' ...
    '\n\nIn the experiment, you will see animations of two triangles.' ...
    '\nYour task is to detect whether a grey dot appeared on either triangle during each trial.' ...
    '\nPress space bar as soon as you see the grey dot.' ...
    '\n\nYou will complete 5 practice trials before proceeding to the actual experiment.' ...
    '\n\nPress space bar to continue.'], 'center', 'center', textColor);           
Screen('Flip', w) ;                            % put warning on screen
RestrictKeysForKbCheck(keyNumSpace); % diregard all keys except space
[~, keyCode]  = KbWait(-1)          ;          % wait for key-press
isSubjIDValid = keyCode(keyNumSpace);          % subject number valid


%% TRIAL ITERATION
iter = 5;
for i = 1:iter

%% RANDOM COORD GENERATION
% frame coordinates
x1Coord = 790;
y1Coord = 450;
x2Coord = 650;
y2Coord = 450;

% radians
numRadians = 327;
numZeros   = 310;
side       = 80;

randomRadians1  = [rand(1, numRadians-numZeros) * 2 * pi, zeros(1, numZeros)];
randomRadians2  = [rand(1, numRadians-numZeros) * 2 * pi, zeros(1, numZeros)];
shuffledIndices = randperm(numRadians);

randomRadians1  = randomRadians1(shuffledIndices);
randomRadians2  = randomRadians2(shuffledIndices);

randomDistance1 = rand(1, numRadians) * 8;
randomDistance2 = rand(1, numRadians) * 8;

% new coordinates
radians = 0;
for i = 1:numRadians-1
    if (randomRadians1(i) == 0)
        randomRadians1(i) = radians;
    else 
        radians = randomRadians1(i);
    end

    xNew = x1Coord(i) + randomDistance1(i)*(cos(radians));
    yNew = y1Coord(i) + randomDistance1(i)*(sin(radians));

    if (xNew < canvasR(3) - 50 && xNew > canvasR(1) + 50 && yNew > canvasR(2) +50 && yNew < canvasR(4) - 50) 
        x1Coord = [x1Coord, xNew];
        y1Coord = [y1Coord, yNew];
    else
        x1Coord = [x1Coord, x1Coord(i)];
        y1Coord = [y1Coord, y1Coord(i)];
    end
end

radians = 0;
for j = 1:numRadians
    if (randomRadians2(j) == 0)
        randomRadians2(j) = radians;
    else 
        radians = randomRadians2(j);
    end

    xNew = x2Coord(j) + randomDistance2(j)*(cos(radians));
    yNew = y2Coord(j) + randomDistance2(j)*(sin(radians));

    if (xNew < canvasR(3) - 50 && xNew > canvasR(1) + 50 && yNew > canvasR(2) +50 && yNew < canvasR(4) - 50) 
        x2Coord = [x2Coord, xNew];
        y2Coord = [y2Coord, yNew];
    else
        x2Coord = [x2Coord, x2Coord(j)];
        y2Coord = [y2Coord, y2Coord(j)];
    end
end


%% Coordinates
t1Orientation = randomRadians1; % random triangle
t2Orientation = randomRadians2;

x    = [x1Coord', (x1Coord - sideL / 2)', (x1Coord + sideL / 2)']; % x11 = [triangleX, triangleX - sideL / 2, triangleX + sideL / 2];
y    = [(y1Coord - (sqrt(3) / 4) * sideL)', (y1Coord + (sqrt(3) / 4) * sideL)', (y1Coord + (sqrt(3) / 4)*sideL)']; % y11 = [triangleY - (sqrt(3) / 4) * sideL, triangleY + (sqrt(3) / 4) * sideL, triangleY + (sqrt(3) / 4)*sideL];

x2   = [x2Coord', (x2Coord - sideL / 2)', (x2Coord + sideL / 2)']; % x11 = [triangleX, triangleX - sideL / 2, triangleX + sideL / 2];
y2   = [(y2Coord - (sqrt(3) / 4) * sideL)', (y2Coord + (sqrt(3) / 4) * sideL)', (y2Coord + (sqrt(3) / 4)*sideL)']; % y11 = [triangleY - (sqrt(3) / 4) * sideL, triangleY + (sqrt(3) / 4) * sideL, triangleY + (sqrt(3) / 4)*sideL];


%% DOT
% Screen('DrawDots', w, dotPosition, dotSize, dotColor, [], 2);
dotFrame = 10;
dotStartFrame = int32(rand() * numRadians - dotFrame); % random dot start frame 0 to (total frames - presentation frame)
dotT = int32(rand() * 1);            % random triangle 0 or 1
% dotC = [0.6, 0.6, 0.6];
dotC = dotColor(iter,:); % color
dotS = 3;            % size
dotStartTime = 0;
dotEndTime = 0;
t = -1;
keyIsDown = 0;

keyPressed = false;
hitTime = 1.5; % secs after probe onset (data analysis)


%% TRIANGLE COORDINATE CALCULATION
tx1 = [];
ty1 = [];
tx2 = [];
ty2 = [];

for i = 1:(numel(x1Coord))
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

    % if (i == dotStartFrame + dotFrame) 
        % dotEndTime = GetSecs;
    % end

    Screen('Flip', w);

    % holding for too long (rt <= 1.5, warning)
    % press twice (rt first time <= 1.5, warning)
    % press once within time frame (rt <= 1.5)
    % press after hit time (rt = -1, warning)
    % press before dot (rt = -1, warning)

    RestrictKeysForKbCheck([keyNumSpace]);
    [keyIsDown, secs, keyCode] = KbCheck;
    if keyCode(keyNumSpace)
        if (secs-dotStartTime>hitTime || dotStartTime == 0) % rt longer than hit time or before dot
            Screen('FillRect', w, screenColor);
            DrawFormattedText(w, 'You made a false alarm', 'center', ymid, textWarningColor);    % display instruction on screen
            Screen('Flip', w);
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

Screen('FillRect', w, screenColor);
Screen('Flip', w);
WaitSecs(1);

reactionT = [reactionT, t];  
end

%% END
sca;



