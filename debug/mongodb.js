import { Types } from 'mongoose'

const ObjectId = Types.ObjectId

const docs = [
  {
    "folder_id": ObjectId("5ebce656640693b620falcfe"),
    "tag": "tag1",
    "doctype": "html",
    "title": "title1",
    "content": "content1",
    "date": new Date(),
    "publish": true
  },
  {
    "folder_id": ObjectId("5ebce656640693b620falcfe"),
    "tag": "tag2",
    "doctype": "html",
    "title": "title2",
    "content": "content2",
    "date": new Date(),
    "publish": true
  },
  {
    "folder_id": ObjectId("5ebce656640693b620falcfe"),
    "tag": "tag2",
    "doctype": "html",
    "title": "title2",
    "content": "content2",
    "date": new Date(),
    "publish": false
  },
  {
    "folder_id": ObjectId("5ebce660640693b620falcff"),
    "tag": "tag1",
    "doctype": "html",
    "title": "title1",
    "content": "content1",
    "date": new Date(),
    "publish": true
  },
  {
    "folder_id": ObjectId("5ebce660640693b620falcff"),
    "tag": "tag2",
    "doctype": "html",
    "title": "title2",
    "content": "content2",
    "date": new Date(),
    "publish": true
  },
  {
    "folder_id": ObjectId("5ebce660640693b620falcff"),
    "tag": "tag2",
    "doctype": "html",
    "title": "title2",
    "content": "content2",
    "date": new Date(),
    "publish": false
  }
]
