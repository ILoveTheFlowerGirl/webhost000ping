import {Document, Error, model, Model, Schema} from "mongoose"

const mongoose = require('mongoose');
export interface _000webhostDocument extends Document {
    auto_id: number
    user: string
    pass: string
    email: string
    subdomain: string
    code: number
    base_url: string
    fail: number
    created_at: Date
    updated_at: Date
    start_sleep: string
    end_sleep: string
    name: string
    ver: string
}

const _000webhostSchema = new mongoose.Schema({
    auto_id: {type: Number, required: true},
    user: {type: String, required: true},
    pass: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    subdomain: {type: String},
    code: {type: Number, required: true},
    base_url: {type: String, trim: true, required: true, unique: true},
    fail: {type: Number},
    created_at: {type: Date},
    updated_at: {type: Date},
    start_sleep: {type: String, trim: true},
    end_sleep: {type: String, trim: true},
    name: {type: String, trim: true},
    ver: {type: String, trim: true}
}, { collection: '000webhost' });

export default model<_000webhostDocument>("000webhost", _000webhostSchema)
