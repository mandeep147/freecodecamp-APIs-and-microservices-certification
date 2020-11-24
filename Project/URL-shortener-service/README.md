# [URL Shortener Microservice](https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/url-shortener-microservice)
Build a full stack JavaScript app that is functionally similar to this: https://url-shortener-microservice.freecodecamp.rocks/.

Working on this project will involve you writing your code on Repl.it on our starter project. After completing this project you can copy your public Repl.it URL (to the homepage of your app) into this screen to test it! Optionally you may choose to write your project on another platform but it must be publicly visible for our testing.

Start this project on Repl.it using this link or clone this repository on GitHub! If you use Repl.it, remember to save the link to your project somewhere safe!

HINT: Do not forget to use a body parsing middleware to handle the POST requests. Also, you can use the function dns.lookup(host, cb) from the dns core module to verify a submitted URL.

Note:
You should provide your own project, not the example URL.

You can POST a URL to /api/shorturl/new and get a JSON response with original_url and short_url properties. Here's an example: { original_url : 'https://freeCodeCamp.org', short_url : 1}

When you visit /api/shorturl/<short_url>, you will be redirected to the original URL.

If you pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain { error: 'invalid url' }