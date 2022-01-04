# NOTE: We include all variables from our env file
# # - Via: https://unix.stackexchange.com/a/348432
include .env
export

.PHONY: setup
setup:
        apt-get update
        sudo apt-get install build-essential
	curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
	sudo apt-get install -y nodejs
	npm i
	npm i -g pm2
