# DonaTrack

* Python (3.10.2)
* Brownie (v1.19.0)
* NodeJS (v16.14.0)
* npm (8.5.3)

This repository is used with https://github.com/baptiste-mouton/dona-back 

## Installation

* Clone the project

```bash
git clone https://github.com/Salim-Azh/dona.git
```

* Install Python : https://www.python.org/downloads/

* Install NodeJS and npm

* Create a .env file at the root of the projet :
Send an email to azharhoussen.salim@gmail.com to get the Account-pivate-key and the Infura-projet-id

```bash 
#at the root of the project 
touch .env
echo export WEB3_INFURA_PROJECT_ID= [Infura-projet-id]  >> .env
echo export PRIVATE_KEY= [Account-pivate-key] >> .env
cat .env
```

* Create a Python virtual environement at the root of the project: https://docs.python.org/fr/3/library/venv.html

```bash 
#at the root of the project 
python3 -m venv ./env
```

* Activate your venv : consult this page for details https://docs.python.org/fr/3/library/venv.html

```bash 
#at the root of the project and depending on your plateforme and CLI
#POSIX
    #bash/zsh
    $ source <venv>/bin/activate

    #fish
    $ source <venv>/bin/activate.fish

    #csh/tcsh
    $ source <venv>/bin/activate.csh

    #PowerShell Core
    $ <venv>/bin/Activate.ps1

#Windows

    #cmd.exe
    C:\\{venv}\\Scripts\\activate.bat

    #PowerShell
    PS C:\\> <venv>\\Scripts\\Activate.ps1
```

* Install project requirements :

```bash
#at the root of the project
pip3 install -r requirements.txt 
```

* Ask for Account-pivate-key to import the account in your MetaMask wallet. This is the same private key that is in the .env file at the root of the project 

* Install client dependencies

```bash
#at the root of the project
cd client
npm install
npm audit fix
```

* Head to https://github.com/baptiste-mouton/dona-back clone the projet and run the command :

```bash
#at the root of the project
npm install
npm audit fix
```

Then create a .env file at the root of the project with the following content: 
```
DB_URL=mongodb+srv://dona-admin:<password>@dona-cluster.ycxcq.mongodb.net/?retryWrites=true&w=majority
```

Send an email to get the `<password>`

## Usage

1. Open the Brownie console. Starting the console launches a fresh [Ganache](https://www.trufflesuite.com/ganache) instance in the background.

    ```bash
    brownie compile
    #and then 
    brownie console
    ```

2. Run the [deployment script](scripts/deploy.py) to deploy the project's smart contracts.

    ```python
    >>> run("deploy")
    ```

3. Head to https://github.com/baptiste-mouton/dona-back and run the command :

```
npm start
```

4. While Brownie is still running, start the React app in a different terminal.
    To do this, navigate to ./client/ and run

    ```bash
    npm start
    ```

4. Connect Metamask to the local Ganache network. In the upper right corner, click the network dropdown menu. Select `Localhost 8545`:


## Ending a Session

When you close the Brownie console, the Ganache instance also terminates and the deployment artifacts are deleted.

To retain your deployment artifacts (and their functionality) you can launch Ganache yourself prior to launching Brownie. Brownie automatically attaches to the ganache instance where you can deploy the contracts. After closing Brownie, the chain and deployment artifacts will persist.

## Further Possibilities

### Testing

To run the test suite:

```bash
brownie test
```