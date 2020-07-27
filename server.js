'use strict';
require('dotenv').config();

const express=require('express');
const cors=require('cors');
const pg=require('pg');
const superagent=require('superagent');
const methodOverride=require('method-override');


const PORT=process.env.PORT;
const client =new pg.Client(process.env.DATABASE_URL);

const server=express();
server.use(express.static('./public'));
server.use(express.json());
server.use(express.urlencoded({extended:true}));
server.use(methodOverride('metho'));
server.set('view engine','ejs');


client.connect()
.then(()=>{
    server.listen(PORT,()=>console.log('Iam listening on PORT:',PORT))
})

server.get('/',show);
server.get('/search',showSearch);
server.post('/dosearch',selectBook);
server.post('/selectthis',insertthis);
server.get('/showMore/:editBookId',showmore)
server.delete('/delet/:deletId',delBook);
server.put('/updateBook/:updId',UpdBook);




function Book(item){
    this.title=item.volumeInfo.title;
    this.image=item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : 'https://pbs.twimg.com/profile_images/378800000532546226/dbe5f0727b69487016ffd67a6689e75a.jpeg' ;
    this.des=item.searchInfo ? item.searchInfo.textSnippet: "No description" ;
    this.auther=item.volumeInfo.authors ? item.volumeInfo.authors[0] : "Ghafri £";
}


function UpdBook(req,res){
    // console.log(req.body)
    const id=req.params.updId;
    const {title,image,auther,des}=req.body;
    const SQL=`update book set title=$1,image=$2,catagory=$3,des=$4 where id=${id};`;
    const value=[title,image,auther,des]
    client.query(SQL,value)
    .then(()=>res.redirect('/'))
}
function delBook(req,res){
    const SQL=`delete from book where id=${req.params.deletId}`
    client.query(SQL)
    .then(()=>res.redirect('/'))
    // console.log(req.params)
}


function showmore(req,res){
const id=req.params.editBookId;
const SQL=`select * from book where id=${id}`
client.query(SQL)
// .then(data=>res.send(data.rows[0]))
.then(data=>res.render('pages/edit',{editing:data.rows}))
// console.log(id,SQL)

}


function insertthis(req,res){
    console.log(req.body)
    const {title,image,auther,des}=req.body;
    const SQL=`insert into book (title,image,des,catagory) values ($1,$2,$3,$4);`;
    const value=[title,image,des,auther];
    client.query(SQL,value)
    .then(data=>res.redirect('/'));
}

function selectBook(req,res){

    const URL=`https://www.googleapis.com/books/v1/volumes?q=${req.body.searchWords}+${req.body.tupeOfsearch}`
    superagent.get(URL)
// .then(data=>res.send(data.body))

    .then(data=>data.body.items.map(item=>new Book (item)))
    .then(searchResult=>{
        res.render('searches/book',{searchin:searchResult})
        // console.log(searchResult)
    })
    // console.log(req.body)
}


function showSearch(req,res){
    res.render('searches/search')

}

function show(req,res){
    const SQL=`select * from book;`;
    client.query(SQL)
.then(data=>res.render('index',{booksShow:data.rows}))

}