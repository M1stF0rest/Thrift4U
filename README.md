The content below is an example project proposal / requirements document. Replace the text below the lines marked "__TODO__" with details specific to your project. Remove the "TODO" lines.

# Thrift4U

## Overview

Students are usually short of budgets, so buying second-hand stuff becomes a temptating option for many of them. For students in China, they often use Wechat groups to do this, which is hard to track past records or search items by categories.

Thrift4U is a web app that functions as a platform for information of second-hand items for sale. Users can register and login. Once they log in, they can search the posted second-hand items and can filter the search options as they want. Moreover, if they want to sell somethimng that they don't need, they can also post them on this web app and manage them later on.


## Data Model

The application will store Users, Lists and Items

* users can have multiple lists (via references)
* each list can have multiple items (by embedding)


An Example User:

```javascript
{
  username: "JerryFranklin",
  password: 23241,
  contact: "Wechat: 13423455",
}
```

An Example Item:

```javascript
{
  ref: 'User' // a reference to a User object
  name: "Calculus101",
  category: "book",
  price: "1000",
  openTobargain: true,
  description:"A textbook for beginners to learn Calculus",
  condition:"Well conditioned",
}
```


## [Link to Commented First Draft Schema](db.mjs) 

## Wireframes

(__TODO__: wireframes for all of the pages on your site; they can be as simple as photos of drawings or you can use a tool like Balsamiq, Omnigraffle, etc.)

/list/create - page for creating a new shopping list

![list create](documentation/list-create.png)

/list - page for showing all shopping lists

![list](documentation/list.png)

/list/slug - page for showing specific shopping list

![list](documentation/list-slug.png)

## Site map

(__TODO__: draw out a site map that shows how pages are related to each other)

Here's a [complex example from wikipedia](https://upload.wikimedia.org/wikipedia/commons/2/20/Sitemap_google.jpg), but you can create one without the screenshots, drop shadows, etc. ... just names of pages and where they flow to.

## User Stories or Use Cases

1. as non-registered user, I can register a new account with the site
2. as a user, I can log in to the site
3. as a user, I can see the infomation of all the available items for sale
4. as a user, I can modify the filters to search for the items I want. 
5. as a user, I can post a item that I want to sell
6. as a user, I can check the list of all the items that I want to sell and modify their attributes if necessary or even remove them. 

## Research Topics

* (2 points) Use a CSS framework found in Semantic UI to make my website neat and beautiful
* (3 points) Perform client side form validation using a JavaScript library
* (3 points) Using a client side javascript we did not cover in class
    * I have not figured what it is yet, but I guarantee it will take a LOT of effort. 
* (2 points) Using a sever side javascript we did not cover in class
    * I have not figured what it is yet, but I guarantee it will take a LOT of effort. 

10 points total out of 8 required points (___TODO__: addtional points will __not__ count for extra credit)


## [Link to Initial Main Project File](app.mjs) 

## Annotations / References Used

(__TODO__: list any tutorials/references/etc. that you've based your code off of)

1. [passport.js authentication docs](http://passportjs.org/docs) - (add link to source code that was based on this)
2. [tutorial on vue.js](https://vuejs.org/v2/guide/) - (add link to source code that was based on this)

