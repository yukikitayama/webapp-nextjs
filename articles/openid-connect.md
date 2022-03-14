## Memo

- In OpenID Connect, client goes through the same process as OAuth, except scope is OpenID Connect.
- Client receives both access token and ID token
- ID token is JSON Web Token (JWT) from which a client can decode identity information.

## Where is OIDC used?

Private `Cloud Functions` can be invoked only by the request with authentication identification. `Cloud Scheduler` is a major tool to invoke `Cloud Functions`. But because the function is private, you need to use `OIDC` to give authentication identification to `Cloud Scheduler` to be able to invoke private `Cloud Functions`. 

## Resource

- [An Illustrated Guide to OAuth and OpenID Connect](https://www.youtube.com/watch?v=t18YB3xDfXI)
- [Using authentication with HTTP Targets](https://cloud.google.com/scheduler/docs/http-target-auth)
- [Use Cloud Scheduler to invoke private Cloud Functions with OIDC](https://cloud.google.com/community/tutorials/using-scheduler-invoke-private-functions-oidc)
- [OpenID Connect](https://developers.google.com/identity/protocols/oauth2/openid-connect)