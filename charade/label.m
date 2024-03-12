charadeLabel = readtable("charades_label.xlsx"); 
charadeData = readtable("charades_summary_.xlsx"); 

videoID  = charadeLabel.id;

row_index = find(charadeData.id == videoID(2));

