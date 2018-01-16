![](header.jpg)

# μzm backend

_(mu-zee-em)_

[![devpost - nwhacks 2018](https://img.shields.io/badge/Devpost-nwHacks%202018-blue.svg)](https://devpost.com/software/tag-it-gpzhuq)

> Let's face it: Museums, parks, and exhibits need some work in this digital era. Why lean over to read a small plaque when you can get a summary and details by tagging exhibits with a portable device? There is a solution for this of course: NFC tags are a fun modern technology, and they could be used to help people appreciate both modern and historic masterpieces. If you're a nwHacks attendee, there's one on your badge right now!

## Backend overview

[stdlib](https://stdlib.com/) handles API calls from the [Android](https://github.com/NotWoods/tag-it) client application. Node.js is used to pull information from a MongoDB database and send it back to the user. Slack is used to present a real-time feed of user interactions with tags.

## Files

Each module in the _functions_ folder represents an API route on stdlib. Tags are represented as a string of random characters, which are stored in mongoDB when the user first registers.

The _scripts_ folder contains scripts that are run locally. The _setup_db_ script loads data from the _exhibit.json_ file into the exhibit collection in the database.

## Routes

### `__main__`

Alias for [`tagged`](#tagged)

### `add_exhibits`

Insert an exhibit into the database.
We ended up not using this for the hackathon, instead using _scripts/setup_db_ to directly insert items into the database.

### `create_user`

Insert or overwrite a user in the database. Their NFC tag data, `tag`, must be provided along with a display name like "Bill".

### `debug`

A dirty hack route we used to print out the entire database. If the `wipe` argument is provided, the corresponding collection will have its contents wiped.

### `get_bulk_info`

Retrive info about some exhibits, based on the array of `ids` you pass. IDs correspond to the exhibit's `key` property in the database. Returns a map of keys to exhibit objects.

### `get_info`

Like [`get_bulk_info`](#get_bulk_info), but for a single exhibit. Returns the exhibit directy rather than inside a map.

### `get_inventory`

Returns an array of strings, where each string is the display name of an item in the user's inventory. Pass the user's tag in the `user_id` parameter.

### `log_transaction`

Adds a interaction between the user (`receiver`) and some tag (`target`). Also takes in the `exhibit` object the user tapped and the `collectible` they received from the exhibit. Optionally the current time can be passed (`date`) as milliseconds since epoch time, but will default to the current time.

This route also calls our Slack bot to add to the real-time feed.

### `tagged`

Called when the user (`userTag`) taps an exhibit (`targetTag`), and transfers a random collectible from the corresponding exhibit to the user.
