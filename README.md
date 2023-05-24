WebRTC video-conferencing with a Matrix homeserver
==================================================

The goal of this project is to implement a WebRTC video-conferencing and chat system with two parts:

* a simple Web interface, based on HTML and JavaScript,
* a Matrix homeserver as signaling server.

The overall goal is to have a Web application to establish video-conferences between two users. 

### Final result
At the end of the development, your Web application should provide the following functionalities:

* A user can sign into Matrix with a username and password.
* A user can join a room on Matrix.
* A user can start a video-conferencing call with another user in the room.
* A user can switch to screen-sharing (this is useful for video calls if you only have one camera)
* A user can accept an incoming call.
* Both users can send text messages during the call.
* A user can hang-up to terminate a call.


Docker-compose
--------------

Use Docker compose to create the server infrastructure. You will need a static Web server and the Matrix homeserver (see below).


Static Web server
-----------------

The static Web server will serve the static HTML and JavaScript files of your Web application. You can use the Python Flask server of the previous lab, or use any other server such as express.js. To start, the server should use http on port 80 and not https. You will secure it later on.

If you use the Python Flask server, you can delete the signaling part of the Python Flask server, since it will not be used. It will be replaced by the Matrix homeserver.


Matrix homeserver
-----------------

You are going to use Matrix as the signaling protocol to implement the video-conferencing system.  The Matrix signaling server is called homeserver. There are several independent implementation of the homeserver specification see [Try Matrix Now](https://matrix.org/docs/projects/try-matrix-now), under "Servers".
We will use the most popular implementation, which is [Synapse](https://matrix.org/docs/guides/installing-synapse), in Python.

An official docker image is available on [Docker Hub](https://matrix.org/docs/guides/installing-synapse). Follow the instructions on that page or the [GitHub page](https://github.com/matrix-org/synapse/tree/master/docker) to generate the config files.

In particular, you have to:

* generate the default configuration files
  ```
  mkdir -p ./matrix-data
  docker run -it --rm --mount type=bind,src=$(pwd)/matrix-data,dst=/data -e SYNAPSE_SERVER_NAME=vmm.matrix.host -e SYNAPSE_REPORT_STATS=yes -e UID=1000 -e GID=1000 matrixdotorg/synapse:latest generate
  ```
* add the server to your docker-compose file and start the infrastructure,
* create an admin user and two other users (e.g. user1, user2, user3). **Use the username as password** (i.e., "user1" as password for user1, etc.).
  ```
  docker exec -it vmm-matrix-1 register_new_matrix_user http://localhost:8008 -c /data/homeserver.yaml -u admin
  docker exec -it vmm-matrix-1 register_new_matrix_user http://localhost:8008 -c /data/homeserver.yaml -u user1
  docker exec -it vmm-matrix-1 register_new_matrix_user http://localhost:8008 -c /data/homeserver.yaml -u user2
  docker exec -it vmm-matrix-1 register_new_matrix_user http://localhost:8008 -c /data/homeserver.yaml -u user3
  ```

* You should check the `server_name` in `./matrix_data/homeserver.yaml`. A name such as `vmm.matrix.host` is ok.
* To check if the homeserver runs correctly, start the docker-compose file and then use a browswer to connect to `http://localhost:8008.


Matrix configuration
--------------------

In order to establish calls, you have to create one or several rooms in Matrix. The easiest way to do this is to use the [Element](https://element.io/) client. The client will also be useful to test your video calls.

On Element:
* Connect to the homeserver http://localhost:8008 with one of the user names (e.g., user1) created previously.
* Create one or several rooms (room1, room2). **Disable end-to-end encryption** when you create the rooms (otherwise there will be errors since the web client does not implement all authentication features).
* Under room "Settings/Local Addresses", define an alias for each room such as `#room1:vmm.matrix.host` and `#room2:vmm.matrix.host`. This is required to connect to the room with a simple name.
* Invite all other users to each room.


SSL certificate
---------------

In order for WebRTC to work, HTTPS is required. You therefore have to enable HTTPS on the static server (but not the Matrix homeserver). You can generate a self-signed SSL certificate with openssl.  Then change the docker files (dockerfile, docker-compose.yml) of the static server to use port 443 and the TLS certificate.

**Trusted certificate**

*The following is not strictly required for the project, but may be useful later.*

For certain functions such as group calls, Matrix requires a *trusted certificate*. A simple self-signed certificate will not work.

You can follow the [instructions](https://letsencrypt.org/docs/certificates-for-localhost/) to create a trusted certificate for localhost. 

You will have to install `localhost.crt` as a locally trusted root certificate on your operating system (e.g. using the tool `certlm.msc` on Windows).

<!--
### Matrix homeserver

To enable HTTPS on the Matrix homeserver, follow the instructions for the [Synapse docker installation](https://github.com/matrix-org/synapse/tree/master/docker#tls-support). You can enable TLS directly on Synapse, instead of using a reverse proxy.
-->

Development of the Web client for matrix
----------------------------------------

The goal of this step is to adapt the Web client to use the Matrix homeserver as signaling server, instead of our custom signaling server in Python.

As a prerequisit to this step you have to use a recent version (>= 18) of Node.js.

* In static-content/, get `index.html` and `browerTest.js` from the [Matrix VoIP example](https://github.com/matrix-org/matrix-js-sdk/tree/master/examples/voip).
* get `browser-matrix.js` from the latest release of the [matrix-js-sdk](https://github.com/matrix-org/matrix-js-sdk/releases) and place it into `static-content/lib/matrix.js` and rename it to `matrix.js`.
* In index.html, load this script (`matrix.js`)
* Adapt `browserTest.js`:
  * login with password following [this documentation](https://matrix.org/docs/guides/usage-of-the-matrix-js-sdk#login-with-an-access-token). You have to use the login method with a password. This allows you to obtain the access token.

Documentation
-------------

To develop the web client, you should use the following documentation:

* [Matrix JS SDK doc](https://github.com/matrix-org/matrix-js-sdk/)
* [MatrixClient doc](http://matrix-org.github.io/matrix-js-sdk/stable/classes/MatrixClient.html)
* [Matrix documentation](https://matrix.org/discover/)

<!--
OLM:
See http://matrix-org.github.io/matrix-js-sdk/23.5.0/index.html#end-to-end-encryption-support
Use Olm 3.2.8 from https://gitlab.matrix.org/api/v4/projects/27/packages/npm/@matrix-org/olm/-/@matrix-org/olm-3.2.8.tgz
-->
