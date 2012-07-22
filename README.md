# Client Banklink
This is a simple JS implementation of IPizza banklink for testing your web application.
Because this works on the client side there are some limitations:
* Only GET is supported.
* Private key and cert are exposed to the browser.
* VK_AUTO requests emulated on client side.

## How to use
* Sign packet parameters with MERCHANT_PRIVATE_KEY(in js/scripts.js)
* Send authentication request to auth/swed.html with parameters in URL.
* Send payment request to payment/swed.html with parameters in URL.
* If you see a red "Verification failed!" message then something isn't right with the signature.
* Fill in form and press the blue button (or red id you want to emulate failed payment, white when VK_AUTO='Y')
* Validate response packet parameters with BANK_CERT(in js/scripts.js)

## Update: 22.07.12
Currently only Swedbank(or possibly other IPizza banks) works. Not much validation of parameters is done.
