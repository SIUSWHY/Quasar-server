generate-certificates:
	if [ ! -d "./certificates" ]; then \
		mkdir ./certificates; \
	fi

	openssl genrsa -aes256 -passout pass:gsahdg -out certificates/server.pass.key 4096
	openssl rsa -passin pass:gsahdg -in certificates/server.pass.key -out certificates/server.key
	rm certificates/server.pass.key
	openssl req -new -key certificates/server.key -out certificates/server.csr
	openssl x509 -req -sha256 -days 365 -in certificates/server.csr -signkey certificates/server.key -out certificates/server.crt
