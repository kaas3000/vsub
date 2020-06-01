<h1 align="center">
  <br>
  <img src="https://raw.githubusercontent.com/kaas3000/vsub/master/images/logo.png" alt="vSub" width="200">
  <br>
  vSub
  <br>
</h1>

<h4 align="center">An application to manage and control <a href="https://www.vmix.com/software/">vMix</a> subtitles remotely.</h4>
<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#development">Development</a> •
  <a href="#download">Download</a> •
  <a href="#credits">Credits</a>
</p>

![screenshot](https://raw.githubusercontent.com/kaas3000/vsub/master/images/screenshot.png)

## Key Features

- Control vMix title's remotely
  - Enable/disable the title input
  - Set the title text remotely with the click of a button
- Prepare your subtitles beforehand
  - Save/load your subtitles from disk
- Keep track of where you are while controlling the subtitles

## Development

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/kaas3000/vsub.git

# Go into the repository
$ cd vsub

# install dependencies
$ npm install

# serve with hot reload at localhost:9080
$ npm run dev

# build electron application for production
$ npm run build


# lint all JS/Vue component files in `src/`
$ npm run lint

```

## Download

You can [download](https://github.com/kaas3000/vsub/releases) the latest version of vSub. It is a portable application. No setup is required.

## Credits

This software uses the following open source packages:

- [Electron](http://electron.atom.io/)
- [Node.js](https://nodejs.org/)
- [Vue](https://github.com/vuejs/vue)
- [node-vmix](https://github.com/jensstigaard/node-vmix)
- [Vuetify](https://github.com/vuetifyjs/vuetify)
