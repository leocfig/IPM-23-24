// Target class (position and width)
class Target
{
  constructor(x, y, w, l, id, fillColor)
  {
    this.x      = x;
    this.y      = y;
    this.width  = w;
    this.label  = l;
    this.id     = id;
    this.fillColor = fillColor;
    this.currentColor = fillColor;
    this.pressed = false;
  }
  
  // Checks if a mouse click took place
  // within the target
  clicked(mouse_x, mouse_y)
  {
    return dist(this.x, this.y, mouse_x, mouse_y) < this.width / 2;
  }
  
  press(){
    this.pressed = true;
  }
  
  unpress(){
    this.pressed = false;
  }
  
  // Changes the color of the target
  changeColor(newColor) {
    this.currentColor = newColor;
  }
  
  // Resets the color of the target
  resetColor() {
    this.currentColor = this.fillColor;
  }
  
  // Draws the target (i.e., a circle)
  // and its label
  draw()
  {
    
    if (this.pressed){
      stroke(255, 0, 0); // Red stroke
      strokeWeight(5); // 5 pixels
    }
    else {
      stroke(0, 0, 0);
      strokeWeight(1);
    }
    
    // Draw target
    fill(this.currentColor); 
    ellipse(this.x, this.y, this.width * 1.4, this.width);
    
    strokeWeight(0);
    
    // Draw label
    textFont("Arial", this.width / 6);
    fill(color(0,0,0));
    textAlign(CENTER, CENTER);

    // Calculates where should the text start to be centered
    let fullTextWidth = textWidth(this.label);
    let textStartX = this.x - fullTextWidth / 2;
    
    // Resets text style to normal
    textStyle(NORMAL);
    
    // Variable to keep track of x position to draw text
    let currentX = textStartX;
    
    // Split the label into words
    let words = this.label.split(' ');
    let baseTextSize = this.width / 6; // Base text size
    let lineHeight = baseTextSize * 1.2; // spacing
    
    let totalTextHeight; 
    // Calculate totalTextHeight
    if (words.length === 1) {
        totalTextHeight = lineHeight; // One line
    } else {
        totalTextHeight = 2 * lineHeight; // Two lines, with spacing
    }

    // Adjust startY to center the text vertically
    let startY = this.y - totalTextHeight / 2 + lineHeight / 2;

    // Loop through each word
    for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
        let word = words[wordIndex];
        let wordWidth = 0;

        // Calculate width of the word 
        for (let i = 0; i < word.length; i++) {
            if (i === 2 && wordIndex === 0) {
                textSize(baseTextSize * 1.05); // Adjust for the 3rd letter if it's the first word
            } else {
                textSize(baseTextSize);
            }
            wordWidth += textWidth(word.charAt(i));
        }

        let wordStartX = this.x - wordWidth / 2; // Center the word horizontally
        let currentX = wordStartX;

        // Draw each letter of the word
        for (let i = 0; i < word.length; i++) {
            let c = word.charAt(i);
            if (i === 2 && wordIndex === 0) {
                textSize(baseTextSize * 1.05);
                textStyle(BOLD);
            } else {
                textSize(baseTextSize);
                textStyle(NORMAL);
            }

            // Draw character with adjusted startY for vertical centering
            if (words.length > 1) {
                text(c, currentX + textWidth(c) / 2, startY + wordIndex * lineHeight);
            } else {
                text(c, currentX + textWidth(c) / 2, startY);
            }

            // Update X position for next character
            currentX += textWidth(c);
        }
    }
    
    

  }
}

