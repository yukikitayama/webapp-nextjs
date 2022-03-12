---
id: "article:12"
---

## Takeaway

- OAuth = **O**pen **Auth**orization. People pronouce "oh-auth".
- Today's industry standard to authenticate API online.
- It's helpful to understand the concept and to be able to use it because most of the APIs today requires you to perform OAuth.

## Clarify confusion "how authentication differs from authorization?"

Before understanding OAuth2, I wasn't even sure what authentication means. Actually I mixed authentication and authorization together and confused. There's a reason for confusion.

**Authentication** is to confirm that a user is who he says he is (Is it confusing? lol). It's a process of confirming the identity of a user or a device.

**Authorization** is to give a user the permission to do something. It's verifying what resources (e.g. data) the user can access and what actionas it can perform (e.g. can delete or not).

It's confusing because sometimes authentication and authorization happens at the same time. For example, a company badge card maybe with your name and face photo. You scan it to badge scanner entry machine pass it to go to the elevator hall. When you scan the card, authentication and authorization happens at the same time. It authenticates that you are the employee of the building, and authorizes that you can enter the building.

## What's up with 2 after OAuth?

The OAuth project began in 2006 by someone at Twitter, and **OAuth 1.0** was published in 2010. But it was replaced with a new **OAuth 2.0** in 2012. As of 2022 in my writing this article, people are using OAuth 2.0.

## Terminology

OAuth concept comes with many technical words. Without knowing what they mean, trying to understand OAuth is painful.

### Resource Owner

Resource actually means many different kind of things, but if you think of data as resource, it will be simple. Resource owner is an owner of the data. Typically resource owner is us. But it could be a system because data is stored in database.

### Client

It sounds like we, users, human, but in OAuth context, client is some sort of automated system that wants to access the resource on behalf of an resource owner. Client needs to have **access token** (explained below) to access the resource. 

### Authorization Server

It authenticate a client, and issues an access token. It's confusing because it authenticates, but it's called authorization server.

### Resource Server

It waits for a client, validates the access token that a client has, and return the resource (e.g. data), and protect the users' data.

## Access Token

The is the key part. To use API, the client needs to have an access token. You, as an owner of your data, don't access token because you are the owner. But client needs to have something properly indicating that it can access your data instead of you.

## Resource

- [What is OAuth 2.0?](https://auth0.com/intro-to-iam/what-is-oauth-2/)
- [Authentication vs Authorization](https://auth0.com/intro-to-iam/authentication-vs-authorization/)
- [What Are Refresh Tokens and How to Use Them Securely](https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/)
- [Wikipedia OAuth](https://en.wikipedia.org/wiki/OAuth)
- [Fitbit API Authorization](https://dev.fitbit.com/build/reference/web-api/developer-guide/authorization/)
- [The Complete Guide to React User Authentication with Auth0](https://auth0.com/blog/complete-guide-to-react-user-authentication/)

<h2>Overview</h2>
<ul>

  <li>OAuth 2 allows an application to use API or to access data on behalf of a user.</li>
</ul>


<h2>Access token</h2>
<ul>
  <li>A piece of data that represents the authorization to access resources on behalf of an user.</li>
  <li>OAuth 2.0 does not define the format, but in practice the JSON Web Token (JWT) is often used.</li>
  <li>To make security better, access tokens have an expiration date.</li>
  <li>If someone steals the access token, it can access data maliciously. This risk is mitigated by expiration date.</li>
  <li>There are several ways to get a new access token when it’s expired.
    <ul>
      <li>The client prompts the user to log in again to get a new access token</li>
      <li>The authorization server issues a refresh token together with access token when access token is issued. The client uses the refresh token to get a new access token when it’s expired.</li>
    </ul>
  </li>
  <li>Refresh token and access token are the concept of OAuth 2.0.</li>
</ul>
<h2>Refresh token</h2>
<ul>
  <li>To have a better security, access token is valid only for a short amount of time</li>
  <li>Client uses the refresh token to get a new access token when it’s expired.</li>
  <li>This allows the client to get the new access token without asking the user to log in again.</li>
  <li>Refresh token also has the expiration and if unexpired, then cannot be used to refresh the access token, but a refresh token has a longer lifespan.</li>
</ul>
<h2>Refresh token rotation</h2>
<ul>
  <li>Every time a client exchanges a refresh token to get an access token, a new refresh token is also returned.</li>
  <li>So people can say a long-lived refresh token is no longer long-lived to mitigate risk.</li>
</ul>
<h2>Grant</h2>
<ul>
  <li>The set of steps a client has to perform to get the resource access authorization.</li>
  <li>There are several types of grant</li>
</ul>
<h3>Authorization code grant</h3>
<ul>
  <li>The authorization server returns a single-use authorization code to the client.</li>
  <li>Client exchanges the authorization code for access token.</li>
  <li>Good for a traditional web application running on the server</li>
</ul>
<h3>Authorization code grant with Proof Key for Code Exchange (PKCE)</h3>
<ul>
  <li>A better authorization code grant</li>
  <li>Good for single page application (SPA) and mobile app.</li>
</ul>
<h3>Implicit grant</h3>
<ul>
  <li>No longer recommended and deprecated because it’s susceptible to security attacks.</li>
  <li>It’s a simplified way that authorization server directly returns an access token to the client.</li>
  <li>No refresh token. Once the access token expires, the user needs to authorize the client again</li>
</ul>
<h3>Refresh token grant</h3>
<ul>
  <li>Exchange refresh token for a new access token</li>
</ul>
