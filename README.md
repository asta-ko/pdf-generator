# PDF Generator

Gets json with array of arrays: [[file_path_to_jpeg_file1, text_description1], ...] and produces pdf with scaled images and headings

### Installation

  - Install latest nodejs
  - Clone this repo
  - `npm install`

### How it works

- `nodejs index.js --file file.json` (There is an example `file.json`)
- `nodejs index.js --json '[["./images/600.jpeg","Text 1"], ["./images/800.jpeg","Text 2"]]'`
- By default pdf is exported to `file.pdf` into the same folder, but there is a parameter `export` to specify export file path, like:  `nodejs index.js --file file.json --export your/path/to/awesome_document.pdf`