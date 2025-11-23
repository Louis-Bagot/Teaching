# Lab sessions for the Deep Learning course

### Lab session 1
In the first lab session we will implement some very simple neural networks to do digit classification. The idea is to do the notebook all together, I will walk you through the commands to teach you about pytorch. 

We will all run the experiments with different values to try out what works best!

### Setting up a virtual environment
You will need to download some python libraries for these lab sessions - mainly pytorch, numpy and matplotlib. The best practice for this is to use a virtual environment (*venv*), so you don't risk affecting your main python environment (which your computer uses) with random libraries and dependencies. If you already have a venv with these libraries, you don't need to install a new one.

How to create a new virtual environment:
``` python3 -m venv my_venv  ```
this creates a folder called `my_venv` in which we will install all the libraries we care about. But first, we need to turn on your virtual environment, from which point all python operations will be down inside of it:
``` source my_venv/bin/activate ```
Now we can install some things! 

There is a `requirements.txt` file in this github folder above, download it and run the following command:
``` pip install -r requirements.txt ```
this should install all the things you need for the lab. The virtual environment makes it so everything is installed inside of your `my_venv` folder, so we are not poisoning out native environment!

If you want to install other things, simply activate your environment again (for anything you want to do with it) and `pip install` stuff.

If you want to run a jupyter notebook, like the one from the course, run 
``` jupyter-notebook``` 
from the activated venv, this will start the notebook *at the place in your path where you ran the command*. If you're not in the folder containing the notebook, you won't be able to click on it.

Best of luck!
