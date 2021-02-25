# Week 1: Introduction to Web Mapping

## Setup for the course

You will need:

- a GitHub account
- a GitHub repository for the course
- On your computer
  - install Git
  - install VS Code
  - install Jekyll

## Install [Git](https://git-scm.com/)
   1. for MacOS, choose "homebrew" option (it takes about 10-15 mins to install homebrew)
   2. Open terminal
   3. `$ brew install git`
   4. Enter `git --version` in your command prompt to make sure it is installed

## Install VS Code

Install the text editor [Visual Studio Code](https://code.visualstudio.com/download)

## Install Jekyll

### MacOS
Install ruby
```bash
# Install Ruby
brew install ruby
```

Add the brew ruby path to your shell configuration:
```bash
# If you're using Zsh (most likely)
echo 'export PATH="/usr/local/opt/ruby/bin:$PATH"' >> ~/.zshrc

# If you're using Bash
echo 'export PATH="/usr/local/opt/ruby/bin:$PATH"' >> ~/.bash_profile

# Unsure which shell you are using? Type
echo $SHELL
```

Relaunch your terminal and check your Ruby setup:

```bash
which ruby
# /usr/local/opt/ruby/bin/ruby

ruby -v
ruby 2.7.2p137 (2020-10-01 revision 5445e04352)
```

You're now running the current stable version of Ruby!

Install the bundler and jekyll gems:

```bash
gem install --user-install bundler jekyll
```

Get your Ruby version:

```bash
ruby -v
ruby 2.7.2p137 (2020-10-01 revision 5445e04352)
```

Append your path file with the following, replacing the X.X with the first two digits of your Ruby version:

```bash
# If you're using Zsh
echo 'export PATH="$HOME/.gem/ruby/X.X.0/bin:$PATH"' >> ~/.zshrc

# If you're using Bash
echo 'export PATH="$HOME/.gem/ruby/X.X.0/bin:$PATH"' >> ~/.bash_profile

# Unsure which shell you are using? Type
echo $SHELL
```

Check that GEM PATHS: points to your home directory:

```bash
gem env
```
