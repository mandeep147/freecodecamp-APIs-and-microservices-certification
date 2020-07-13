##API Project:  - Exercise Tracker Microservice
Build a full stack JavaScript app that is functionally similar to this: https://nonstop-pond.glitch.me/.

1. I can provide my own project, not the example url.

1. I can create a user by posting form data username to `/api/exercise/new-user` and returned will be an object with username and _id.

1. I can get an array of all users by getting `api/exercise/users` with the same info as when creating a user.

1. I can add an exercise to any user by posting form data userId(_id), description, duration, and optionally date to `/api/exercise/add`.    
If no date supplied it will use current date. App will return the user object with the exercise fields added.

1. I can retrieve a full exercise log of any user by getting `/api/exercise/log` with a parameter of userId(_id).     
App will return the user object with added array log and count (total exercise count).

1. I can retrieve part of the log of any user by also passing along optional parameters of from & to or limit. (Date format yyyy-mm-dd, limit = int)