This project is a custom Gutenberg Block for WordPress. It allows you to select and album from Last.FM and save all of that metadata so you don't have to manually enter it.

Below you will find some information on how to setup and use this plugin in a WordPress local enviroment. 

## 👉  `Install The Plugin`
- You can download this code as a ZIP from GitHub and install it like a normal plugin or...
- <code>git clone</code> this repository into your <code>/wp-content/plugins</code>.
- If you want to poke around and have fun do the following.
- <code>cd</code> into that directory and run the following in your terminal
- <code>npm install</code>
- <code>npm run build</code>
- If you don't have NPM and Node installed you can learn more about that at <a href="https://www.npmjs.com/get-npm">https://www.npmjs.com/get-npm</a>

---

## 🎶  `Get a Last.FM API Key`
- Go to <a href="https://www.last.fm/api/account/create">https://www.last.fm/api/account/create</a>. 
- Either sign-in or sign-up for Last.FM
- Fill out the Contact email and Appliication name field the rest are not needed.
- Click the Submit Button. You will then have your API Key. Save this somewhere important as you won't be able to retrieve it again. (Hint: Save the page CTRL + S and store it somewhere good.).

---

## 🚀  `Activate and Setup`
- Go to Plugins > Installed Plugins > Album Review - A Gutenberg Block > Activate
- Go to Settings > Album Review Settings and enter your Last.FM API Key. Click the "Save Changes" button after entering your API key. 

---

## 👓  `Usage of this plugin`
- Go to any page or post that is using the Gutenberg Editor
- Add a new Block > Album Review
- You can either search for an album(if you entered your API Key) and have all the fields populated for you, or manually enter all of the information for an album.
- Click on the amount of stars you would like to rate this album. 
- You will be able to see a Front End Preview below all of the editable fields. 
- Click on Publish/Save once you are happy with the results. 