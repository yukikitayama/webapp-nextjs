
## Idea

In Angular, you can make multiple HTTP requests by coding multiple get method calls of HttpClient. But we have no control over how those multiple responses come back. It will be random timing.

Here, we want to wait for all the responses to come back before aggregating them.

It's useful when making multiple HTTP requests on page load.

These requests concurrently make requests. Angular will wait for all the responses to finishe before making subsequent actions.

## How to Use

The argument of `forkJoin(argument)` is an array or an object of `Observables`.

Use `subscribe()` method of `forkJoin()` to actually make requests.

## Reference

- [forkJoin](https://www.learnrxjs.io/learn-rxjs/operators/combination/forkjoin)
- [Subscribing to Multiple Observables in Angular Components](https://coryrylan.com/blog/subscribing-to-multiple-observables-in-angular-components)
- [Communicating with backend services using HTTP](https://angular.io/guide/http)
- [Getting started with Angular](https://angular.io/start)
- [Random Data Generator](https://random-data-api.com/)