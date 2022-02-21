<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h1 align="center">PokeQuest</h3>
  <h5 align="center">A Pokemon Fan-Game</h5>
</div>

<!-- Credit -->

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* Battle System uses the [Pokemon Showdown Simulator](https://github.com/smogon/pokemon-showdown/tree/master/sim)
* Pokemon gifs are from [pokemonshowdown/sprites](https://play.pokemonshowdown.com/sprites/)
* Pokemon icons are from [msikma/pokesprite-spritesheet](https://github.com/msikma/pokesprite-spritesheet/)
* Background gif is by [@emimonserrate](https://twitter.com/emimonserrate) and NOT MINE
* Music is [Pokemon Reorchestrated](https://twitter.com/pkmnreorch) by Braxton Burks|Materia Collective

<!-- ABOUT THE PROJECT -->
## About The Project

A round-based game where you battle other players and create the best team possible. Over the course of 19 rounds you and other players compete to win the most points by catching Pokemon, besting trainers, and battling other players. You randomly encounter different Pokemon and trainers every play-through, creating endless replayability.
Can only be played with an even amount of players.

<h3>Round 1 - Choosing your Starter</h3>
Choose between the original gen 1 starters or make it completley random in the pre-game settings.

<h3>Round 2 - The First Wild Encounter</h3>
Choose between 3 different random locations to search for wild Pokemon. Some areas are more rare than others, this will be destinguished by a glowing color.  
Once you choose, a random Pokemon from that area will appear. Choose to catch it and add it to your team, or make it faint to gain more candy.

<h3>Round 3 - The First Trainer Battle</h3>
These trainer battles are 1v1 NPC battles, and don't count as much towards your score. Similarly to the wild areas, trainers have different rarities, the more rare, the harder they are to beat. However, harder trainers give better rewards. Remember, these battles are a 1v1.

<h3>Round 4 - Round 6</h3>
Wild battles and trainer battles will alternate.

<h3>Round 7 - The First Player Battle</h3>
Everyone will be randomly put against another player and participate in a 3v3 battle. You gain 1 point for each Pokemon you knock out and 1 more point if you win.

<h3>Round 8 - Round 12</h3>
New Trainers and Pokemon now appear. Wild battles and trainer battles will alternate.

<h3>Round 13 - The Second Player Battle</h3>
Everyone will be randomly put against another player and participate in a 3v3 battle. You gain 1 point for each Pokemon you knock out and 1 more point if you win.

<h3>Round 14 - Round 18</h3>
New Trainers and Pokemon now appear. Wild battles and trainer battles will alternate.

<h3>Round 19 - The Final Player Battle</h3>
Everyone will be randomly put against another player and participate in a 3v3 battle. You gain 1 point for each Pokemon you knock out and 1 more point if you win. The winner is then decided based on the most points

<h3>Trading</h3>
After a Player battle, you and your opponent are given the opportunity to trade 1 Pokemon for 1 Pokemon.

<h3>Shop</h3>
Every round the shop contains 3 new random items. These items range in rarity and can be held by a pokemon. You can reroll the shop by spending money as well as buy Pokeballs. 

### Built With

Front-End  
* [Next.js](https://nextjs.org/)
* [MaterialUI](https://github.com/mui/material-ui)

Server  
* [Socket.io](https://github.com/socketio/socket.io)

## How to Run
There are two servers that need to be run- PokeServerExpress and the poke-client-next. You can run each by using `npm run dev`. Requires you to have node installed.  

For the client you need to create .env.local with the following:  
`NEXT_PUBLIC_ROOT_URL="<URL OF CLIENT>:3000"` 
`NEXT_PUBLIC_SERVER_URL="<URL OF SERVER>:3001"`  

The url should be `http://<localhost or ip>:PORT` 
To play with other people you need to either be on the same network, use a virtual LAN like hamachi, or port forward. You supply different links depending  

For the Server you can edit the `setup.json` and change the ip field to the ip you want the server to start on. It starts on port 3001.

To restart the game, have everyone refresh the page in their browser then just crtl-s on any file in the server, because of nodemon it will restart the server and the game.
<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<!-- CONTACT -->
## Contact

Zachary Buce - [@zachbuce](https://twitter.com/zachbuce)


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png
