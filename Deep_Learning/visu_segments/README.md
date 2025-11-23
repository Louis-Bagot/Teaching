# Visualization of Linear Regression for digit identification

If we could extract the different segments of the digit like a 7-segment clock (e.g. gymnasium ones), then a linear regression could do the trick.

To convince yourself of that, try it out yourself! [Click on this link](https://download-directory.github.io/?url=https%3A%2F%2Fgithub.com%2FLouis-Bagot%2FTeaching%2Ftree%2Fmain%2FDeep_Learning%2Fvisu_segments) to download the contents of this folder. Unzip the folder and run (double click) the `neural_net_segments.html` file to start the tool.  Once you see the neural network, you can do the following operations:
- click on a single link to change its value. As a starting point, play around with just +1 and -1 values
- click on a digit to change the values of all the weights leading to it. 
- click on the segments to simulate their activation - if you want to draw a 1, you need to activte both segments on the right. When you do, the probability for each digit (in blue) should change automatically. 
- click on "Evaluate Loss" to see how good your solution is. Take a few minutes to try and come up with the best loss you can! Let's see who in the class can make it fall the lowest.
