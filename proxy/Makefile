# NOTE: We include all variables from our env file
# - Via: https://unix.stackexchange.com/a/348432
include ../.env
export

.PHONY: testing
testing:
	echo $(HOSTNAME)

.PHONY: install
install: install-deps configure-ssl configure-nginx

.PHONY: install-deps
install-deps:
	apt-get update -y
	apt-get upgrade -y
	apt-get install -y nginx certbot python3-certbot-nginx python3-setuptools

.PHONY: renew-cert
renew-cert:
	certbot renew && nginx -s reload

# We use ONESHELL in this target, as we only want a certificate to be issued
# in case non is provided (e.g. in production).
.ONESHELL:
SHELL := /bin/bash
.PHONY: configure-ssl
configure-ssl:
	cp ./configs/nginx-letsencrypt.conf $(NGINX_MAIN_CONFIG)
	mkdir -p $(LETS_ENCRYPT_DIR)/$(HOSTNAME)/
	if [[ ! -f $(LETS_ENCRYPT_DIR)/$(HOSTNAME)/fullchain.pm \
	    && ! -f $(LETS_ENCRYPT_DIR)/$(HOSTNAME)/privkey.pem ]]; then
	    certbot certonly --nginx -d $(HOSTNAME) --non-interactive --agree-tos \
	        -m $(ADMIN_EMAIL);
	fi

.PHONY: configure-nginx
configure-nginx:
	cp ./configs/nginx-final.conf $(NGINX_MAIN_CONFIG)
	sed -i "s/{DOMAIN}/strikedao.com-0001/" $(NGINX_MAIN_CONFIG)
	systemctl enable nginx
	systemctl start nginx
	nginx -s reload
	nginx -V 2>&1 | grep -qF -- --with-http_auth_request_module && \
	    echo "auth_request module available through installation." || \
	    echo "ERROR: auth_request module NOT available. Please install separately."
