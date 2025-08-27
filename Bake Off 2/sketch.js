// Bake-off #2 -- Seleção em Interfaces Densas
// IPM 2023-24, Período 3
// Entrega: até às 23h59, dois dias úteis antes do sexto lab (via Fenix)
// Bake-off: durante os laboratórios da semana de 18 de Março

// p5.js reference: https://p5js.org/reference/

// Database (CHANGE THESE!)
const GROUP_NUMBER        = 12;     // Add your group number here as an integer (e.g., 2, 3)
const RECORD_TO_FIREBASE  = true;   // Set to 'true' to record user results to Firebase

// Pixel density and setup variables (DO NOT CHANGE!)
let PPI, PPCM;
const NUM_OF_TRIALS       = 12;     // The numbers of trials (i.e., target selections) to be completed
let continue_button;
let legendas;                       // The item list from the "legendas" CSV

// Metrics (DO NOT CHANGE!)
let testStartTime, testEndTime;     // time between the start and end of one attempt (8 trials)
let hits 			      = 0;      // number of successful selections
let misses 			      = 0;      // number of missed selections (used to calculate accuracy)
let database;                       // Firebase DB  

// Study control parameters (DO NOT CHANGE!)
let draw_targets          = false;  // used to control what to show in draw()
let trials;                         // contains the order of targets that activate in the test
let current_trial         = 0;      // the current trial number (indexes into trials array above)
let attempt               = 0;      // users complete each test twice to account for practice (attemps 0 and 1)

// Target list and layout variables
let targets               = [];
const GRID_ROWS           = 8;      // We divide our 80 targets in a 8x10 grid
const GRID_COLUMNS        = 10;     // We divide our 80 targets in a 8x10 grid

let legendas_array;                 // The bidimensional array from the "legendas" CSV
let hit_sound;                      // The sound of when the right target is clicked on
let miss_sound;                     // The sound of when the wrong target is clicked on
let column_img;                     // The image exemplifying the game (columns version) to be shown before its start
let row_img;                        // The image exemplifying the game (columns version) to be shown before its start

// Progress Bar properties
let progressBarPosition = 0;
let progressBarIncrement = 0; // Adjust
const progressBarHeight = 13;
const progressBarY = 0;
let guessResults = []; 

let start_game = false;
let columns_checkbox;
let rows_checkbox;
let order_choice;


// Ensures important data is loaded before the program starts
function preload()
{
  // id,name,...
  legendas = loadTable('legendas.csv', 'csv', 'header');
  
  // Loading the sounds
  hit_sound = loadSound("Sounds/hit_sound.mp3");
  miss_sound = loadSound("Sounds/miss_sound.mp3");
  
  // Loading the images
  column_img = loadImage("Final_Board.png");
  row_img = loadImage("Board_Rows.png");
}

// Runs once at the start
function setup()
{
  createCanvas(700, 500);    // window size in px before we go into fullScreen()
  frameRate(60);             // frame rate (DO NOT CHANGE!)
  
  randomizeTrials();         // randomize the trial order at the start of execution
  drawUserIDScreen();        // draws the user start-up screen (student ID and display size)
  
  // shows order info to user
  info_text = createDiv("How would you like the words to be ordered alphabetically?");
  info_text.id('info_text');
  info_text.position(92, 175);
  
  columns_checkbox = createCheckbox("By COLUMNS");
  columns_checkbox.position(100, 240);
  columns_checkbox.style('color:white');
  columns_checkbox.style('font-size: 16px; font-family: Arial;');
  columns_checkbox.style('transform: scale(2);');
  
  rows_checkbox = createCheckbox("By ROWS");
  rows_checkbox.position(85, 320);
  rows_checkbox.style('color:white');
  rows_checkbox.style('font-size: 16px; font-family: Arial;');
  rows_checkbox.style('transform: scale(2);'); // Increase checkbox size
}

// Runs every frame and redraws the screen
function draw()
{
  if (draw_targets && attempt < 2)
  {     
    // The user is interacting with the 6x3 target grid
    background(color(0,0,0));        // sets background to black
    
    // Print trial count at the top left-corner of the canvas
    textFont("Arial", 16);
    fill(color(255,255,255));
    textAlign(LEFT);
    text("Trial " + (current_trial + 1) + " of " + trials.length, 30, 25);

    // Draw progress bar 
    progressBarPosition = 0; // Reset position each frame to redraw from start
    for (let i = 0; i < guessResults.length; i++)
    {
      fill(guessResults[i] ? color(0, 200, 0) : color(200, 0, 0));
      rect(progressBarPosition, progressBarY, progressBarIncrement, progressBarHeight, 4);
      progressBarPosition += progressBarIncrement;
    }
    
    // Draw all targets
	for (var i = 0; i < legendas.getRowCount(); i++) targets[i].draw();
    
    // Draw the label for each color group of targets
    if (order_choice === 1) {
      
      textSize(targets[0].width / 4);
      textStyle(BOLD);
      fill(color(255, 185, 242));
      text("Ba", (targets[8].x + targets[16].x) / 2, 30);

      textSize(targets[0].width / 4);
      textStyle(BOLD);
      fill(color(187,252,144));
      text("Be", width * (2/5) + (targets[0].width / 1.3), 30);

      textSize(targets[0].width / 4);
      textStyle(BOLD);
      fill(color(159,253,255));
      text("Bh", width / 2 + (targets[0].width / 1.3), 30);

      textSize(targets[0].width / 4);
      textStyle(BOLD);
      fill(color(255,213,156));
      text("Bi", width * (3/5) + (targets[0].width / 1.4), 30);

      textSize(targets[0].width / 4);
      textStyle(BOLD);
      fill(color(211,176,255));
      text("Br", (targets[56].x + targets[64].x) / 2, 30);

      textSize(targets[0].width / 4);
      textStyle(BOLD);
      fill(color(255,255,188));
      text("Bu", width - (targets[0].width), 30);

      textSize(targets[0].width / 4);
      textStyle(BOLD);
      fill(color(183,217,255));
      text("Bo", width * (3/5) + (targets[0].width)*1.4, (targets[51].y + targets[52].y) / 2);

      textSize(targets[0].width / 4);
      textStyle(BOLD);
      fill(color(252,164,164));
      text("BL", width * (3/5) + (targets[0].width)*1.4, (targets[49].y + targets[50].y) / 2);

      textSize(targets[0].width / 4);
      textStyle(BOLD);
      fill(color(255,204,229));
      text("Bn", width * (3/5) + (targets[0].width)*1.4, (targets[50].y + targets[51].y) / 2);

      textSize(targets[0].width / 4);
      textStyle(BOLD);
      fill(color(255, 185, 242));
      text("By", width - (targets[0].width)/4, height - targets[0].width*1.4);
    }
    
    else {
      
      textSize(targets[0].width / 4);
      textStyle(BOLD);
      fill(color(255, 185, 242));
      text("Ba", (targets[4].x + targets[5].x) / 2, 30);

      textSize(targets[0].width / 4);
      textStyle(BOLD);
      fill(color(187,252,144));
      text("Be", (targets[16].x + targets[17].x) / 2 , (targets[17].y + targets[26].y) / 2);

      textSize(targets[0].width / 4);
      textStyle(BOLD);
      fill(color(183,217,255));
      text("Bo", (targets[41].x + targets[42].x) / 2 , (targets[41].y + targets[51].y) / 2);

      textSize(targets[0].width / 4);
      textStyle(BOLD);
      fill(color(159,253,255));
      text("Bh", (targets[17].x + targets[18].x) / 2 , (targets[27].y + targets[37].y) / 2);

      textSize(targets[0].width / 4);
      textStyle(BOLD);
      fill(color(255,213,156));
      text("Bi", (targets[30].x + targets[31].x) / 2 , (targets[30].y + targets[40].y) / 2);

      textSize(targets[0].width / 4);
      textStyle(BOLD);
      fill(color(211,176,255));
      text("Br", (targets[45].x + targets[46].x) / 2 , (targets[41].y + targets[51].y) / 2);

      textSize(targets[0].width / 4);
      textStyle(BOLD);
      fill(color(255,255,188));
      text("Bu", (targets[68].x + targets[69].x) / 2 , (targets[59].y + targets[69].y) / 2);

      textSize(targets[0].width / 4);
      textStyle(BOLD);
      fill(color(252,164,164));
      text("BL", targets[0].width / 4, (targets[40].y + targets[50].y) / 2);

      textSize(targets[0].width / 4);
      textStyle(BOLD);
      fill(color(255,204,229));
      text("Bn", (targets[40].x + targets[41].x) / 2 , (targets[40].y + targets[50].y) / 2);

      textSize(targets[0].width / 4);
      textStyle(BOLD);
      fill(color(255, 185, 242));
      text("By", width - (targets[0].width)/4, (targets[69].y + targets[79].y) / 2);
      
    }
    
    textStyle(NORMAL);
    
    // Draws the target label to be selected in the current trial. We include 
    // a black rectangle behind the trial label for optimal contrast in case 
    // you change the background colour of the sketch (DO NOT CHANGE THESE!)
    fill(color(0,0,0));
    rect(0, height - 40, width, 40);
 
    textFont("Arial", 20); 
    fill(color(255,255,255)); 
    textAlign(CENTER); 
    //text(legendas.getString(trials[current_trial],1), width/2, height - 20);
    text(legendas_array[trials[current_trial]][1], width/2, height - 20);
  }
}

// Print and save results at the end of 54 trials
function printAndSavePerformance()
{
  // DO NOT CHANGE THESE! 
  let accuracy			= parseFloat(hits * 100) / parseFloat(hits + misses);
  let test_time         = (testEndTime - testStartTime) / 1000;
  let time_per_target   = nf((test_time) / parseFloat(hits + misses), 0, 3);
  let penalty           = constrain((((parseFloat(95) - (parseFloat(hits * 100) / parseFloat(hits + misses))) * 0.2)), 0, 100);
  let target_w_penalty	= nf(((test_time) / parseFloat(hits + misses) + penalty), 0, 3);
  let timestamp         = day() + "/" + month() + "/" + year() + "  " + hour() + ":" + minute() + ":" + second();
  
  textFont("Arial", 18);
  background(color(0,0,0));   // clears screen
  fill(color(255,255,255));   // set text fill color to white
  textAlign(LEFT);
  text(timestamp, 10, 20);    // display time on screen (top-left corner)
  
  textAlign(CENTER);
  text("Attempt " + (attempt + 1) + " out of 2 completed!", width/2, 60); 
  text("Hits: " + hits, width/2, 100);
  text("Misses: " + misses, width/2, 120);
  text("Accuracy: " + accuracy + "%", width/2, 140);
  text("Total time taken: " + test_time + "s", width/2, 160);
  text("Average time per target: " + time_per_target + "s", width/2, 180);
  text("Average time for each target (+ penalty): " + target_w_penalty + "s", width/2, 220);

  // Saves results (DO NOT CHANGE!)
  let attempt_data = 
  {
        project_from:       GROUP_NUMBER,
        assessed_by:        student_ID,
        test_completed_by:  timestamp,
        attempt:            attempt,
        hits:               hits,
        misses:             misses,
        accuracy:           accuracy,
        attempt_duration:   test_time,
        time_per_target:    time_per_target,
        target_w_penalty:   target_w_penalty,
  }
  
  // Sends data to DB (DO NOT CHANGE!)
  if (RECORD_TO_FIREBASE)
  {
    // Access the Firebase DB
    if (attempt === 0)
    {
      firebase.initializeApp(firebaseConfig);
      database = firebase.database();
    }
    
    // Adds user performance results
    let db_ref = database.ref('G' + GROUP_NUMBER);
    db_ref.push(attempt_data);
  }
}

// Mouse button was pressed - lets test to see if hit was in the correct target
function mousePressed() 
{
  // Only look for mouse releases during the actual test
  // (i.e., during target selections)
  if (draw_targets)
  {
    for (var i = 0; i < legendas.getRowCount(); i++)
    {
      // Check if the user clicked over one of the targets
      if (targets[i].clicked(mouseX, mouseY)) 
      {
        // Checks if it was the correct target
        if (targets[i].id === trials[current_trial] + 1) 
        {
          hits++;
          guessResults.push(true);
          
          // Plays the sound of a target being hit
          hit_sound.play();

          // Changes the color of the selected target
          targets[i].press();
          targets[i].draw();

        } 
        else 
        {
          misses++;
          guessResults.push(false);
          
          // Plays the sound of a miss
          miss_sound.play();
        }
        
        current_trial++;              // Move on to the next trial/target
        break;
      }
    }
    
    // Check if the user has completed all trials
    if (current_trial === NUM_OF_TRIALS)
    {
      testEndTime = millis();
      draw_targets = false;          // Stop showing targets and the user performance results
      printAndSavePerformance();     // Print the user's results on-screen and send these to the DB
      attempt++;                      
      
      // If there's an attempt to go create a button to start this
      if (attempt < 2)
      {
        continue_button = createButton('START 2ND ATTEMPT');
        continue_button.mouseReleased(continueTest);
        continue_button.position(width/2 - continue_button.size().width/2, height/2 - continue_button.size().height/2);
      }
    }
    // Check if this was the first selection in an attempt
    else if (current_trial === 1) testStartTime = millis(); 
  }
}

// Evoked after the user starts its second (and last) attempt
function continueTest()
{
  // Re-randomize the trial order
  randomizeTrials();
  
  // Resets performance variables
  hits = 0;
  misses = 0;
  
  current_trial = 0;
  continue_button.remove();
  
  for (var i = 0; i < legendas.getRowCount(); i++)
  {
    // Resets the color of the targets
    targets[i].unpress();
  }
  
  //Resets progress bar
  guessResults = [];
  
  // Shows the targets again
  draw_targets = true; 
}



// Creates and positions the UI targets
function createTargets(target_size, horizontal_gap, vertical_gap)
{
  // Define the margins between targets by dividing the white space 
  // for the number of targets minus one
  h_margin = horizontal_gap / (GRID_COLUMNS -1);
  v_margin = vertical_gap / (GRID_ROWS - 1);
  
  // Sorts the bidimensional array according to the label, alphabetically
  legendas_array = legendas.getArray();
  legendas_array.sort((a,b) => a[1].localeCompare(b[1]));
  for (var i = 0; i < legendas.getRowCount(); i++) legendas_array[i][0] = i + 1;
  
  i = 0;
  var c;
  var r;
  
  if (order_choice === 1) {
  
    // Set targets in a 8 x 10 grid
    for (c = 0; c < GRID_COLUMNS; c++)
    {
      for (r = 0; r < GRID_ROWS; r++)
      {
        let target_x = 40 + (h_margin + target_size) * c + target_size/2;        // give it some margin from the left border
        let target_y = (v_margin + target_size) * r + target_size/2;

        // Find the appropriate label and ID for this target
        let legendas_index = c + GRID_COLUMNS * r;
        let target_id = legendas_array[i][0];
        let target_color = colorTarget(legendas_array[i][1]);

        let target_label = legendas_array[i++][1];

        let target = new Target(target_x, target_y + 40, target_size, target_label, target_id, target_color);
        targets.push(target);
      }  
    }
  }
  
  else {
    
    // Set targets in a 8 x 10 grid
    for (r = 0; r < GRID_ROWS; r++)
    {
      for (c = 0; c < GRID_COLUMNS; c++)
      {
        let target_x = 40 + (h_margin + target_size) * c + target_size/2;        // give it some margin from the left border
        let target_y = (v_margin + target_size) * r + target_size/2;

        // Find the appropriate label and ID for this target
        let legendas_index = c + GRID_COLUMNS * r;
        let target_id = legendas_array[i][0];
        let target_color = colorTarget(legendas_array[i][1]);

        let target_label = legendas_array[i++][1];

        let target = new Target(target_x, target_y + 40, target_size, target_label, target_id, target_color);
        targets.push(target);
      }  
    }
  }
}

// Is invoked when the canvas is resized (e.g., when we go fullscreen)
function windowResized() 
{
  if (fullscreen() && start_game === true)
  {
    resizeCanvas(windowWidth, windowHeight);
    progressBarIncrement = width / NUM_OF_TRIALS;
    
    // DO NOT CHANGE THE NEXT THREE LINES!
    let display        = new Display({ diagonal: display_size }, window.screen);
    PPI                = display.ppi;                      // calculates pixels per inch
    PPCM               = PPI / 2.54;                       // calculates pixels per cm
  
    // Make your decisions in 'cm', so that targets have the same size for all participants
    // Below we find out out white space we can have between 2 cm targets
    let screen_width   = display.width * 2.54;             // screen width
    let screen_height  = display.height * 2.54;            // screen height
    let target_size    = 2;                                // sets the target size (will be converted to cm when passed to createTargets)
    let horizontal_gap = screen_width - target_size * GRID_COLUMNS;// empty space in cm across the x-axis (based on 10 targets per row)
    let vertical_gap   = screen_height - target_size * GRID_ROWS;  // empty space in cm across the y-axis (based on 8 targets per column)

    // Creates and positions the UI targets according to the white space defined above (in cm!)
    // 80 represent some margins around the display (e.g., for text)
    createTargets(target_size * PPCM, horizontal_gap * PPCM - 80, vertical_gap * PPCM - 80);

    // Starts drawing targets immediately after we go fullscreen
    draw_targets = true;
  }
}


function addNewline(str) {
    let words = str.split(' ');

    if (words.length > 1) {
        return words.join('');
    } else { // If there's only one word
        return str;
    }
}

function colorTarget(label){
  let secondLetter = label.charAt(1);

  switch (secondLetter){
    case 'a':
    case 'y':
      return color(255, 185, 242);
    case 'e':
      return color(187,252,144);
    case 'é':
      return color(187,252,144);
    case 'n':
      return color(255,204,229);
    case 'u':
      return color(255,255,188);
    case 'r':
      return color(211,176,255);
    case 'h':
      return color(159,253,255);
    case 'l':
      return color(252,164,164);
    case 'i':
      return color(255,213,156);
    case 'o':
      return color(183,217,255);
    default:
      return 'green';
  }
}


function validChoice()
{
  
  if((columns_checkbox.checked() && !rows_checkbox.checked()) || (rows_checkbox.checked() && !columns_checkbox.checked())) {
    
    if (columns_checkbox.checked()) {
      order_choice = 1;
    }
    else {
      order_choice = 0;
    }
    return true;
  }
  else
  {
    alert("Please choose only one way of ordering");
	return false;
  }
}


