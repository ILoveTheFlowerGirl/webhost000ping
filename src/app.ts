require("dotenv").config({path: __dirname + "/../.env"})

import createError from "http-errors"
import express from "express"
import path from "path"
import logger from "morgan"
import cheerio from "cheerio"

import {AxiosResponse} from "axios"

const axios = require('axios').default
import mongoose from "mongoose"
import {CronJob} from "cron"
import _000webhost, {_000webhostDocument} from "./models/webhost000.model"


const app = express()

let mongodbUri = process.env.MONGODB_URI
mongoose.connect(mongodbUri, {useNewUrlParser: true}, err => {
    if (err) {
        console.log("Unable to connect to the mongoDB server. Error:", err)
    } else {
        //HURRAY!! We are connected. :)
        console.log("Connection established to", mongodbUri)

        new CronJob("0 */10 * * * *", () => {
            _000webhost.countDocuments(function (err, count) {
                const skip = Math.floor(Math.random() * count)
                console.log(skip)
                _000webhost.findOne().skip(skip).exec().then((doc: _000webhostDocument) => {
                    console.log(new Date() + ": " + doc.base_url)
                    axios.get(doc.base_url).then((response: AxiosResponse) => {
                        parser(doc, response.data)
                    }).catch((err: any) => {
                        parser(doc, err.response.data)
                    })
                })
            })
        })
    }
})

const parser = function (doc: _000webhostDocument, html: any) {
    const $ = cheerio.load(html)

    const title = $("head title")
    const messageTitle = $(".message__title")

    if (messageTitle.text() == "Website is archived.") {
        doc.name = messageTitle.text()
    } else {
        doc.name = title.text()
    }
    console.log(doc.name)
    _000webhost.updateOne({_id: doc._id}, doc).exec()

}

// view engine setup
app.set("views", path.join(__dirname, "../views"))
app.set("view engine", "pug")

app.use(logger("dev"))
app.use(express.json())

// catch 404 and forward to error handler
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    next(createError(404))
})

// error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = process.env.NODE_ENV === "development" ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render("error")
})

app.disable("x-powered-by")

export {app}
