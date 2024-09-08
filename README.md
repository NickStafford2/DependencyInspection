# NPM Visual

This tool creates a visual graph of popular NPM packages. Data is scraped from various package.json files. We then analyize them to identify interesting package relationships. 

One goal is to identify packages that are not well maintained, but are heavily relied on by massive companies. It would also be nice to find packages that are heavily relied on that have unusual liscences.

# Installation and Environment Setup
Clone the repo to your local machine
~~~
git clone git@github.com:PraveenKusuluri08/npm_visual.git
~~~
Install Python 3.6.9
First install pyenv on your system. Follow instructions here. Be sure to update the path and install all packages pyenv depends on.
https://github.com/pyenv/pyenv

Install Python 3.6.9
~~~
pyenv install 3.6.9
~~~

Install pipx via instructions here
https://pipx.pypa.io/stable/installation/
be sure to update path info

~~~
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc && source ~/.bashrc
~~~

I had to install python3.8-venv on my machine to install poetry
~~~
pip install pipx
sudo apt install python3.8-venv
~~~

Install poetry. Know that you may need to use the --force option
~~~
pipx install poetry
pipx upgrade poetry
~~~

Make sure poetry is installed 
~~~
poetry --version
~~~
My version is 1.8.3 installed using Python 3.8.10 
Poetry requires a python version ^=3.8 to install. but the Python version can be different. 

## Setup Environment
Initialize pre-existing project
cd to this directory
~~~
poetry init
~~~

(Optional) In your global config, set virtual environments to be stored locally in project.
~~~
poetry config virtualenvs.in-project true
~~~




# ToDo
Add additional notes here. We should use Github tasks.

# Warnings
We should consider carefully if we want to commit poetry.toml to git. In the future, it may have sensitive user-specific information. 


