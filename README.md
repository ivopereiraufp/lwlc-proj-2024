# Delilah-Resto
**An API for restaurants**

This project consists of a RESTful API based on Node.JS and MySQL for the administration of online restaurants that allows regular users to create an account, view different products, have favorite dishes and create orders, while administrator users control access and management of CRUD operations regarding orders, users and products.

# First things first
**Clone the repo**
````
git clone https://github.com/SebasNatale/Delilah-Resto
````
_the DB was deployed to remotemysql.com and access keys are included in the repo, no need to build it from scratch!_

[Queries to create the tables](/db_structure.sql)

**Install the dependencies**
````
npm install
````

**Run the API**
````
node index
````

_The API domain is "localhost:3000"_

# API spec
[Documento](/spec.yaml)

**Special indications**

- When creating a new user, the API will ask for a boolean for the "admin" key. That's only for demo purposes and does not represent production behavior.

- When sending the token, do NOT use the keyword "bearer" as value for the "Authorization" header.
