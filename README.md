# Usage

To "install" this game, you will need a simple webserver that can serve static files (Apache will do). You simply upload this git repository into a folder on the web server, and access index.html in your browser.

You can use the mongoose executable mongoose-free-5.6.exe which will provide the following tray:

![mongoose start](tut3.png)

and simply browse to your local IP address (as done automatically by clicking on the link on the screenshot)


The game loads a question bank (default questions.json) in the same root directory as index.html. This file contains the game-seperated question sets described in the next section.

# Scraping / Question bank

To make question harvesting easier, I included a python script in /util that scrapes indiabix.com for questions.

The root directory has questions.json which is the main question file, and another question set stored in questions2.json. The program only reads questions.json.

# Question format

The question bank is simply an array of "games". You can have as many "games" as you like. You select them at the beginning of loading index.html.

	{
		"games" : [
			{
				"questions" : [ ... ]
			},
			{
				"questions" : [ ... ]
			}, ...
		]
	}

Each array of questions is in the following format.

1.	"content" is the key for the possible answer texts. "content" must have a length of 4 (4 multiple choices).
2.	The question prompt text is located in the key "question"
3.	The zero-based index of the value in "content" that is the correct answer is located in the key "correct"



	    {
	        "question" : "What is Aurora Borealis commonly known as?",
	        "content" : [
	            "Fairy Dust",
	            "Northern Lights",
	            "Book of ages",
	            "a Game of Thrones main character"
	        ],
	        "correct" : 1
	    }


# Who Wants to Be a Millionaire Materials

The sounds and images used from Who Wants to Be a Millionaire, and the questions used from India-Bix and other sources are not mine, nor do I claim any involvement in their creation. The materials are used under Fair Use for academic and educational purpose, and should not be redistributed otherwise without permission from their creators.


# Key bindings
|key | action |
|----|--------------------|
|1-4 | chose question A-D |
|j   | joker |
|p   | replay this video |
|r   | replay last video |
|e   | end game (win) |
|<   | last level |
|>   | next level |

