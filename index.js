"use strict";

const PDFDocument = require('pdfkit')
const sizeOf = require('image-size');
const dashdash = require('dashdash');
const fs = require('fs');


const options = [{
        names: ['json', 'j'],
        type: 'string',
        help: 'Provide json string'
    },

    {
        names: ['file', 'f'],
        type: 'string',
        help: 'Provide json file path'
    },

    {
        names: ['export', 'e'],
        type: 'string',
        help: 'Export pdf to'
    }


];

let opts = dashdash.parse({
    options: options
});

let data;

let exportFile = opts.export || 'file.pdf'

if (!exportFile.includes('.pdf')) {
    exportFile += '.pdf'
}

if (opts.json) {
    data = JSON.parse(opts.json)
} else if (opts.file) {
    data = require(opts.file)
} else {
    console.log("Please provide json data via --json param or --file param")
    return
}

const validate = require('jsonschema').validate;
const validator_result = validate(
    data, {
        "type": "array",
        "items": {
            "type": "array",
            "minItems": 2,
            "maxItems": 3
        }
    });

if (validator_result.errors.length) {
    console.log('Please provide valid data: ' + validator_result.errors)
    return
}

const doc = new PDFDocument({
    size: [595.28, 841.89],
    autoFirstPage: false,
    margins: {
        top: 20,
        bottom: 0,
        left: 20,
        right: 20
    },
});

for (let x of data) {
    let bigText;
    const count = data.indexOf(x) + 1
    const imagePath = x[0]
    /*if (!fs.existsSync(imagePath)) {
        console.log('Incorrect image path: ' + imagePath)
        return
    }*/
    const text = x[1]
    if (x[2]) {
        bigText = x[2]
    }

    renderPage(imagePath, text, bigText, count)
}

function renderPage(imagePath, text, bigText, count) {

    doc.addPage()
    doc.font('fonts/times.ttf').text(text, 20, 20, {
        align: 'right'
    }).moveDown(0.5)


    const text_height = doc.heightOfString(text, {
        width: 555.28
    });

    const big_text_height = doc.heightOfString(bigText, {
        width: 555.28
    });

    if (imagePath != '') {
        const dimensions = sizeOf(imagePath);
        if (dimensions.width > dimensions.height && !bigText) {
            doc.save()
            doc.rotate(90)
            doc.image(imagePath, 27 + text_height, -575.28, {
                'fit': [770 - text_height, 555.28],
                'valign': 'center'
            })
            doc.restore()
        } else if (dimensions.width > dimensions.height && bigText) {
            doc.image(imagePath, {
                'fit': [555.28, 770],
                'align': 'center',
            }).moveDown(1).text(bigText)
        } else if (dimensions.width < dimensions.height || dimensions.width == dimensions.height) {
            doc.image(imagePath, {
                'fit': [555.28, 770],
                'align': 'center',
            })

            if (770 - doc.y > big_text_height) {
                doc.moveDown(1).text(bigText);
            }

        } else if (bigText) {
            doc.text(bigText);
        }
        doc.text(count, 300, 810)

    }
}
doc.end();

doc.pipe(fs.createWriteStream(exportFile))
console.log('PDF generation success')