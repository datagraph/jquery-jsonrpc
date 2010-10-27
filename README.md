# jQuery JSON RPC 2.0

A JSON RPC 2.0 compatible client library and jQuery plugin.

## Getting Started

The simplest way to configure jsonRPC is via the setup method

    $.jsonRPC.setup({
      endPoint: '/rpc',
      namespace: 'datagraph'
    });

Once you've configured an end point, making requests is a matter of

    $.jsonRPC.request('method.name', params, {
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

And after your call, your endPoint and namespace are back to their defaults.  Or you can override the end point for a single request via

    $.jsonRPC.request('method.name', [1,2,3], null, '/anotherEndPoint');

## Run the tests

Tests have been written using QUnit.  You can run the tests [here](http://github.com/datagraph/jquery-jsonrpc/raw/master/test/index.html).

## Authors, Development, License, Thanks

#### Authors
 * Josh Huckabee <joshhuckabee@gmail.com>

#### 'License'
This plugin is free and unemcumbered software released into the public
domain.  For more information, see the included UNLICENSE file.

#### Contributing
Fork it on Github and go.  Please make sure you're kosher with the UNLICENSE
file before contributing.

#### Thanks
Inspiration for this plugin came from (and is partly based on) the following existing plugins:

* [http://plugins.jquery.com/project/C4PCJsonRPC](http://plugins.jquery.com/project/C4PCJsonRPC) via [safchain](http://plugins.jquery.com/users/safchain)
* [http://plugins.jquery.com/project/jsonRPC2](http://plugins.jquery.com/project/jsonRPC2) via [kusmierz](http://plugins.jquery.com/user/30124)
