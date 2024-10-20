!/bin/bash
# Execute this script if you need to generate private key
# ./generate_private_key.sh or bash -c generate_private_key.sh
ssh-keygen -t rsa -b 3072 -m PEM -f private-key.pem
openssl rsa -pubout -in private-key.pem -out public-key.pem