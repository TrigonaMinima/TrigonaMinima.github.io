---
layout: post
title: "Flask in Production"
date: 2020-05-29
categories: Python Flask Backend Production
annotation: Python
---


After coding your flask app, when you do flask run, you get the following warning:

> WARNING: Do not use the development server in a production environment.
> Use a production WSGI server instead.

Here want to discuss why it warns not to use the development server in production and what to do instead. Along the way, I'll also look into the whole python application production setup and why it is the way it is.

# Bundled Server

When you do `flask run` (or `python myapp.py`), Flask uses [Werkzeug's](https://palletsprojects.com/p/werkzeug/) development server. Flask documentation has a section on [Deployment Options](https://flask.palletsprojects.com/en/1.1.x/deploying/) which at the top asks not to use the built-in server:

> While lightweight and easy to use, **Flask’s built-in server is not suitable for production** as it doesn’t scale well. Some of the options available for properly running Flask in production are documented here.

The reasons of why not to use the development server (relevant [SO answer](https://stackoverflow.com/a/12269934/2650427)):

- It will not handle more than one request at a time by default.
- If you leave debug mode on and an error pops up, it opens up a shell that allows for arbitrary code to be executed on your server (think os.system('rm -rf /')).
- The development server doesn't scale well.

So what's the solution? Solution is WSGI. Let's understand, why we need WSGI. The next few sections are largely derived (at many places, reproduced as is) from this [reddit post](https://www.reddit.com/r/Python/comments/8bb102/why_shouldnt_one_use_flask_bottle_django_etc/dx5qklz/).

# Problem with normal web servers

There are normal web servers like, Apache or nginx, which are built to handle web requests. They run on port 80 and handle static files efficiently. So, if you are serving any static assets like images or videos, need low-level caching, or have higher concurrency demands, it's recommended to use a webserver like [nginx](http://nginx.org/) and have it handle all of your requests.

Problem is, these servers don't know what to do with python applications (beyond simple [cgi](https://en.wikipedia.org/wiki/Common_Gateway_Interface)).

The problem of normal web servers is solved by application servers.

# Application Servers

Application servers can run python applications. As an absolute minimum they know how to keep python interpreter in the memory, so that it does not need to be restarted on each request. Usually application servers can also start multiple processes and handle multithreading etc. Application servers can not run on port 80, and by default they are not good with handling static files.

# General Request Process

<span style="display:block;text-align:center">
![output-agreement-games]({{ site.url }}/assets/2020-05/flask_prod_01.png)
</span>

When you request a url using browser or any other interface, this request is proxied to an application server, application server engages your python application, and response is proxied back to Apache and then returned to you.

At first, application servers were not standardized. At some point people settled on [WSGI](https://en.wikipedia.org/wiki/Web_Server_Gateway_Interface) specification that defined how (WSGI) application server should interact with (WSGI) python application. Since then all python web frameworks have focused on creating WSGI applications that can be published by different WSGI servers.

Gunicorn, uwsgi, waitress, wsgiref.simple_server.WSGIServer etc all are examples of application servers that implement WSGI specification.

When you do `flask run`, you are actually starting a development WSGI server that comes with Flask by default. And it publishes your WSGI application. This development WSGI server is very limited. That's why you need to use a real one for production.

# Request Process with a WSGI Server

Using a WSGI server, the process looks something like this:

<span style="display:block;text-align:center">
![output-agreement-games]({{ site.url }}/assets/2020-05/flask_prod_02.png)
</span>

There are standalone WSGI servers, like gunicorn. And as I said, normally you proxy your requests from a web server to an application server.

There are WSGI servers that are coupled with web servers. They have a special way to interact with web server machinery and get directly into request handling. So, they have like a direct bridge, and external proxying is not necessary. In this sense

- [mod_wsgi](https://modwsgi.readthedocs.io/en/develop/) is coupled with Apache, and
- uWSGI with nginx


<span style="display:block;text-align:center">
![output-agreement-games]({{ site.url }}/assets/2020-05/flask_prod_03.png)
</span>

## Deployment option: mod_wsgi (Apache)

[Flask documentation](https://flask.palletsprojects.com/en/1.1.x/deploying/mod_wsgi/) suggests using mod_wsgi if we are using [Apache](https://httpd.apache.org/) webserver. The [mod_wsgi homepage](https://modwsgi.readthedocs.io/en/develop/) says this:

> The mod_wsgi package implements a simple to use Apache module which can host any Python web application which supports the Python WSGI specification.

This [Quick Configuration Guide](https://modwsgi.readthedocs.io/en/develop/user-guides/quick-configuration-guide.html) explains how to make a basic python application which uses Apache webserver with mod_wsgi (WSGI) application server to host a (simple) python application.

If the application is hosted using Apache, and application fails for some reason, then automatic application restarts are handled by the Apache.

## Deployment option: Gunicorn (nginx)

> Gunicorn 'Green Unicorn' is a Python WSGI HTTP Server for UNIX. It's a pre-fork worker model. The Gunicorn server is broadly compatible with various web frameworks, simply implemented, light on server resources, and fairly speedy.

Although, [Gunicorn](https://gunicorn.org/) can handle HTTP requests, they strongly suggest to use it behind nginx. Since, nginx and Gunicorn, don't handle the automatic application restarts if it fails for some reason, you'll need to add [supervisor](http://supervisord.org) into the mix.

## Deployment option: uWSGI (nginx)

According to the [Flask documentation](https://flask.palletsprojects.com/en/1.1.x/deploying/uwsgi/), FastCGI is a deployment option on servers like [nginx](https://nginx.org/), [lighttpt](https://www.lighttpd.net/) and [cherokee](http://cherokee-project.com/).

uWSGI is a protocol as well as an application server. The application server can serve uWSGI, FastCGI, and HTTP protocols. Most popular uWSGI server is [uwsgi](https://uwsgi-docs.readthedocs.io/en/latest/). Although, uwsgi supports HTTP requests, a proper webserver should be used as it's not as good as a webserver at hosting static files. Since, nginx and uwsgi, don't handle the automatic application restarts if it fails for some reason, you'll need to add [supervisor](http://supervisord.org) into the mix.

## Deployment option: FastCGI (nginx)

According to the [Flask documentation](https://flask.palletsprojects.com/en/1.1.x/deploying/fastcgi/), FastCGI is a deployment option on servers like [nginx](https://nginx.org/), [lighttpt](https://www.lighttpd.net/) and [cherokee](http://cherokee-project.com/). It can also work with Apache, but if you're using Apache webserver then it's recommended to go with mod_wsgi.

FastCGI is a protocol as well as an application server. The application sever serves the FastCGI protocol. Most popular FastCGI application server is [flup](https://pypi.org/project/flup/).

Since, nginx and FastCGI, don't handle the automatic application restarts if it fails for some reason, you'll need to add [supervisor](http://supervisord.org) into the mix.

<br>

General patterns I observed being in use:

- `apache` + `mod_wsgi`
- `nginx` + `uwsgi`
- `nginx` + `uwsgi` + `supervisor`
- `nginx` + `gunicorn`
- `nginx` + `gunicorn` + `supervisor`

# Resources which helped me with the above basics

- [Is the server bundled with Flask safe to use in production?](https://stackoverflow.com/q/12269537/2650427)
- [Why shouldn't one use Flask, Bottle, Django, etc. directly, and always use WSGI?](https://www.reddit.com/r/Python/comments/8bb102/why_shouldnt_one_use_flask_bottle_django_etc/dx5qklz/)
- [Flask Documentation](https://flask.palletsprojects.com/en/1.1.x/)
- [Quickstart for Python/WSGI applications](https://uwsgi-docs.readthedocs.io/en/latest/WSGIquickstart.html)
- [Zero to Hero: Flask Production Recipes](https://www.toptal.com/flask/flask-production-recipes)

# Deploying Flask app through Docker

I think, building a docker container for a Flask app is the right approach as you have to setup things one time and after that it just works. You just have to do `docker run` and voila!

Following articles helped helped me setup the Docker container for my Flask app with a production server.

- [Running Flask in production with Docker](https://smirnov-am.github.io/running-flask-in-production-with-docker/)
- [Developing a Flask API in a Docker container with uWSGI and NGINX](https://medium.com/@gabimelo/developing-a-flask-api-in-a-docker-container-with-uwsgi-and-nginx-e089e43ed90e)
- [Zero to Hero: Flask Production Recipes](https://www.toptal.com/flask/flask-production-recipes)

These links are to help myself if I get stuck setting up things next time. I'll document my process once I am more comfortable with the whole ecosystem and have explored the major options available.
