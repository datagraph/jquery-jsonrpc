# JSON RPC 2.0 jQuery Plugin

A [JSON RPC 2.0](http://groups.google.com/group/json-rpc/web/json-rpc-2-0) compatible client library and jQuery (1.4, 1.5, and 1.6 compatible) plugin.

## First, a quick compatibility note

If you need to support IE6 & IE7, you will need to include Douglas Crockford's [JSON](https://github.com/douglascrockford/JSON-js) library in order for this plugin to work.  The specific file you need from that repository is json2.js.

## Getting Started

The simplest way to configure jsonRPC is via the setup method

    $.jsonRPC.setup({
      endPoint: '/rpc',
      namespace: 'datagraph'
    });

This will set a default endpoint and namespace for all subsequent requests.

Once you've configured an end point, making requests is a matter of

    $.jsonRPC.request('method.name', {
      params: params,
      success: function(result) {
        // Do something with the result here
        // It comes back as an RPC 2.0 compatible response object
      },
      error: function(result) {
        // Result is an RPC 2.0 compatible response object
      }
    });

Want to do batch requests?  We've got you covered

    $.jsonRPC.batchRequest([
        {
          method: 'method.one',
          params: [1,2,3]
        },
        {
          method: 'method.two'
        }
      ], {
        success: function(result) {
          // Handle response object here
        }
      }
    });

Need to temporarily override your end point or namespace?  Easy enough...

    $.jsonRPC.withOptions({
      endPoint: '/anotherRpc',
      namespace: 'somethingElse'
    }, function() {
      this.request('method.name');
    });

After your call, your endPoint and namespace are back to their defaults.  Or you can override the end point for a single request via

    $.jsonRPC.request('method.name', {
      params: [1,2,3],
      endPoint: '/anotherEndPoint'
    });

## Running the tests

The tests currently rely on being able to successfully make local AJAX calls to load test data. This works fine in Firefox (3.6, 4, and 5), but WebKit (Chrome and Safari) does not allow file-based AJAX calls. To successfully run tests in Safari or Chrome, you will need to serve the tests from a proper web server like Apache or Nginx. The tests have been verified against jQuery 1.4, 1.5, and 1.6.

## Authors, License, Development, Thanks

#### Authors
 * Josh Huckabee <joshhuckabee@gmail.com>
 * Chris Petersen <cpetersen@mythtv.org>
 * Jerry Ablan <opensource@pogostick.com>

#### 'License'
This plugin is free and unemcumbered software released into the public
domain.  For more information, see the included UNLICENSE file.

#### Development / Contributing
Fork it on Github and go.  Please make sure you're kosher with the UNLICENSE
file before contributing.

Add your tests (see test directory), make sure they all pass, and submit
a pull request.

#### Thanks
Inspiration for this plugin came from (and is partly based on) the following existing plugins:

* [http://plugins.jquery.com/project/C4PCJsonRPC](http://plugins.jquery.com/project/C4PCJsonRPC) via [safchain](http://plugins.jquery.com/users/safchain)
* [http://plugins.jquery.com/project/jsonRPC2](http://plugins.jquery.com/project/jsonRPC2) via [kusmierz](http://plugins.jquery.com/user/30124)
