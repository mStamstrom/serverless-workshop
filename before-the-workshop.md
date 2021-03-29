# Setting up before the workshop

Thanks for joining the workshop. Below is a list of things you'll need to set up and check. In case you run into any issues, please get in touch with me directly (see <https://gojko.net/about/>) before the workshop, so I can help you troubleshoot and check everything.

## Software prerequisites 

### Python 3.7 or later

Although we won't be programming in Python, we'll need Python to run SAM, the AWS tool for deploying serverless applications, and the AWS command line tools. Check if it's already installed:

```
python --version
```

If the command errors, or if the printed version is < 3.7, install Python 3 for your operating system from <https://www.python.org/downloads/>

### Pip

`pip` is the python package manager. It's bundled with most python distributions, so once you've installed Python, you should most likely have pip installed. Check if it exists using 

```
pip --version
```

Some Linux distributions may set up `pip` as `pip3`, so if the previous command prints an error, check if you have `pip3` installed.

If the command prints an error, install it using instructions from <https://pip.pypa.io/en/stable/installing/>


### Node.js 14 or later

We'll be programming in JavaScript, and you'll need Node.js 14 or later for running tests locally. Check if it's already installed:

```
node --version
```

If the command prints an error, or if the printed version is < 14, install Node.js 14 for your operating system from <https://nodejs.org/en/download/>


### NPM 6 or later

NPM is the Node package manager. It comes in most Node distributions, so once Node is installed, you most likely have it. Check if it's there using 

```
npm --version
```

If the command prints an error, you most likely have a very minimal Node environment. Install the full Node.js environment for your operating system from  <https://nodejs.org/en/download/>, then confirm NPM is installed.

If the command prints a version earlier than 6, install the latest version using

```
npm install npm@latest -g
```


### Git

We'll use Git to distribute workshop code. Check if you have it installed using:

```
git --version
```

If the command prints an error, set it up for your system from <https://git-scm.com/downloads>

### Docker (optional)

SAM can simulate Lambda environments locally using Docker. If possible, also install Docker from <https://www.docker.com/products/docker-desktop> .

The free desktop version is enough for everything we need in this workshop.

### Virtualenv (optional)

`virtualenv` is a good way to set up isolated Python environments with local packages. You can use it to isolate the stuff we need for the workshop from things that you might need on your system for other purposes. You do not need to set up virtualenv, but I recommend using it for isolation.

Check if you have `virtualenv` installed using

```
virtualenv --version
```

If it's not there, install it using `pip`:

```
pip install virtualenv
```

Next, create a virtual python environment in a working directory:

```
virtualenv -p python3 python-env
```

#### Activating the virtual environment

To activate the virtual environment, use

```
source python-env/bin/activate
```

On a Unix (MacOs included), confirm that the virtual environment is active using 

```
which python
```

On Windows, use

```
where python
```

This should print the active Python path, and this should be under your new virtual environment.
Make sure virtualenv installed python 3.7 or later by running:

```
python --version
```

#### Deactivating virtual environments

Later, when you want to deactivate the virtual environment, just use

```
deactivate
```

This will switch back to your basic operating system Python installation.

### AWS client software

(if you want to use a virtual environment, make sure it's active before running the following commands)

First, ensure you're running the latest version of `pip`

```
pip install --upgrade pip
```

Next, set up the AWS client software using `pip`, run the following command:

```
pip install awscli aws-sam-cli cfn-lint
```

Verify that the tools were installed correctly, by running the following commands:

```
aws --version
sam --version
cfn-lint --version
```

SAM version should be `1.21.1` or later. If it's not, run the install again with `--upgrade`.

## AWS Account set-up

Register for an AWS account upfront if you don't already have one. To use Lambda, you'll need a verified account (typically using phone verification). The stuff we'll do will fit into the free account allowance, so you will not need to pay AWS anything for the workshop, but you will still need an account. Register at [aws.amazon.com/](https://aws.amazon.com)

It's important that every participant has a separate AWS account for the workshop. If your team members share the same AWS account, you can either register a new account personally, or ask your AWS account administrator to set up individual sub-accounts. For more information, see <https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_create.html>

Your account must have the following IAM roles:

* [arn:aws:iam::aws:policy/IAMFullAccess](https://console.aws.amazon.com/iam/home?region=us-east-1#policies/arn:aws:iam::aws:policy/IAMFullAccess) 
* [arn:aws:iam::aws:policy/PowerUserAccess](https://console.aws.amazon.com/iam/home?region=us-east-1#policies/arn:aws:iam::aws:policy/PowerUserAccess)
 
If you have a company AWS account and intend to use it during the workshop, please make sure that you have access rights specified above. (if your main company account does not have that, ask your account admin to create a sub-account and grant it those rights).

### Set up credentials for AWS command line tools

Configure AWS Command Line tools to [work with your credentials](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html). If you do not want to use your primary account, [set up a separate profile](https://docs.aws.amazon.com/cli/latest/userguide/cli-multiple-profiles.html) for the workshop account.

### Test your account

Run the following command to verify that your account is correctly configured

```
aws sts get-caller-identity
```

If you set up a separate profile, then add `--profile PROFILE_NAME` to the command.

If the command prints an error, go back to configuring the command line tool credentials

## Testing the configuration

This test will check that you have everything installed correctly.

```
git clone https://github.com/gojko/serverless-workshop-march-2021.git
cd serverless-workshop-march-2021/setup-test
sam deploy -g
```

The command should prompt you to answer a bunch of questions and ask you to confirm a few times (including after printing some stuff, when it looks like it started to work). 

* When prompted to answer yes or no, always answer `Y` (note that some questions will have 'No' as the default answer, so you'll need to type `Y` explicitly)
* When prompted for something else, use the default answer.

At the end, the command should print something like

```
CloudFormation outputs from deployed stack
-------------------------------------------------------------------------------------------------------------------------------------------------------
Outputs                                                                                                                                               
-------------------------------------------------------------------------------------------------------------------------------------------------------
Key                 Url                                                                                                                               
Description         API Gateway endpoint URL for Prod stage for Hello World function                                                                  
Value               https://something-here.amazonaws.com/Prod/hello/                                                                
-------------------------------------------------------------------------------------------------------------------------------------------------------

Successfully created/updated stack - sam-app in us-east-1
```

Check the URL printed by your command in the 'Value' row above (load it in a browser or use `curl` from the command line). It should print `hello world`. 

If you got `hello world` - congratulations, everything is set up.

If you did not get `hello world`,  please get in touch with me directly (see <https://gojko.net/about/>) before the workshop, so I can help you troubleshoot and set up everything.

### Testing the Docker installation

If you installed Docker for local testing, try it out using

```
sam local start-api
```

Then browse to https://localhost:3000/hello. This should also print "hello world". Note that the first time you browse to this URL, it will take a long time, since Docker is building the initial image.


