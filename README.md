# facilitatorFormHAARTKenya

Hi there! You found the repository containing the code for the facilitator form, nice!

Let's go ahead and try to get this running on your machine.

Note: The following instructions are for Mac/Linux. If you have a windows machine you'll have to do some googling to get this off the ground. If you get stuck at any point DM me (Michael) on slack.

1.  Open up your Terminal and type 'git'. If this throws a 'command not found error', you'll need to install git. (Should be the first result when you google 'install git')

2.  Install homebrew here: https://brew.sh/

3.  Install NodeJS by running 'brew install node'

4.  Install MongoDB by running 'brew install mongodb'

5.  In your terminal, run 'cd ~' to return to the root.

6.  Run 'git clone https://github.com/Hack4Impact-Boston-University/facilitatorFormHAARTKenya.git'

7.  Type 'ls'. You should see a folder called facilitatorFormHAARTKenya.

8.  Type 'cd facilitatorFormHAARTKenya'

9.  Run 'npm install'

10. Open a new terminal tab (Shell -> new tab), and run 'brew services start mongodb' in that new tab.

11. Return to the previous tab, and Run 'npm start'

12. Open up your favorite browser, and go to "localhost:3000". You should be looking at the site!

13. When you are done, in the tab running mongo run 'brew services stop mongodb' and hit "ctrl + c" in the tab running npm.

14. Congrats! Hopefully you got here without too much trouble :) To begin working on the site, open up facilitatorFormHAARTKenya folder in the text editor of your choice. (I prefer Atom, but Sublime Text and Brackets are also quite popular.)

15. After you've completed your task for the week, don't worry too much about submitting. We'll cover how we'll take our code from our local machines back to GitHub at the next meeting.

# Notes on Developing

I've tried to leave comments where applicable, but here are some general guidelines.

1.  Don't worry about what's going on in .git, bin, node_modules, package-lock.json, and package.json. Those are mostly just set up files that NodeJS took care of for us.

2.  In the models folder is where you'll put your javascript files representing your Mongo schemas. I've done a rough start of the Account schema as a guideline. If your task involved this, I can share some MongoDB resources and Mongoose (the library that connects Mongo to Node) Documentation.

3.  If you ever need to store any images, fonts, stylesheets, scripts, or any other static resource to the site, you'll save them in the public folder.

4.  All of the routes should be created in index.js. In general, most of the back end work will be done index.js. You can just ignore users.js for now.

5.  In the views folder, you'll find all of our frontend files. Those files are pretty much just html files, but the .hbs allows us to do some pretty cool stuff with conditional statements and loops inside our html. The .hbs extension also allows us to pass data from the backend to the frontend. Here's a link to learn more about that: https://handlebarsjs.com/

6.  You may or may not need to touch app.js. This file basically is what starts up our server and gets everything set up accordingly. If you end up installing more node packages and plugins, you'll half to make add some code to this file.

I know this is a lot at once, and apoligies again for not being able to be there in person today. If you have at all have any questions about getting the site set up on your machine, how to complete your task, or you just want more resources to help you learn, please let me know!! I'm always just a slack message away.
