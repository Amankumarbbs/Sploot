# Sploot Assignment <img align="right" src="https://github.com/Amankumarbbs/sploot/assets/34418398/f681f3b6-acb2-4e6d-b367-d8e447f1b720" height="100" width="100">

This repository is for a project as a part of assessment for Sploot. 
It is hosted using render. The postman collection is included in the repo.

<br clear="right"/>

## Backend RESTful APIs in NodeJS with ExpressJS framework and MongoDB Database.

This service has a user who will be able to signup and login. Only The authenticated (logged in) user will be able to perform actions like creating an Article, Retrieving all Articles and updating their own user profile. The expiry of the user session is two hours.

User Resource has email, password, name and age. Email is unique.
Article Resource has a title and description. 
One Article can have only one author (user).

### APIs
1. Api to signup a user with email and password.

**Endpoint : api/signup**

NOTE: 
Apis should have basic validations on the request inputs, ensuring no Duplicate Users and Proper error responses.
Password should be stored in an encrypted format. Use any encryption libraries like bcrypt

2. API to login a user with email and password.

	**Endpoint: api/login**

NOTE: 
Apis should have basic validations on the request inputs and Proper error responses.
API should return JWT auth token in the response.
Use JWT token to maintain for user authentication of resources and apis in next features.

3. API to create an Article.

**Endpoint: api/users/:userId/articles**


NOTE:
This protected Api should be authenticated using the JWT in the authorization header of the request.

4. API to get all articles

	**Endpoint: api/articles**

NOTE:
Every article in the response should contain the user info who created them, respectively
This protected Api should be authenticated using the JWT in the header of request.

5. API to update user profile. Only name and age are editable.
	
	**Endpoint: api/users/:userId**

All requests and responses are in JSON format.
