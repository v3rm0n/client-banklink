# Client Banklink
This is a simple JS implementation of IPizza and Nordea banklinks for testing your web application.
Because this works on the client side there are some limitations:
* Only GET is supported.
* Private key and cert are exposed to the client.

## How to use
* Sign packet parameters with MERCHANT_PRIVATE_KEY(in js/scripts.js)
* Send banklink request to bank.html with parameters in URL.
* If you see a red "Verification failed!" message then something isn't right with the signature.
* Fill in form and press the blue button
* Validate response packet parameters with BANK_CERT(in js/scripts.js)

## Update: 22.07.12
Currently only Swedbank(or possibly other IPizza banks) 4001 request and 3002 response works.
