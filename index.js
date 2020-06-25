const express= require("express")
const redis= require("redis")
const fetch= require("node-fetch")
const PORT=process.env.PORT || 3000
const REDIS_PORT=process.env.PORT || 6379

const client=redis.createClient(REDIS_PORT)
const app=express()
app.use(express.json());
app.get('/index/:username',r_cache,getrepos)

// creating api call to github
async function getrepos(req,res,next){
    try{
        console.log("feching...");
        const userName= req.params.username;
        console.log(userName);
        const responses=await fetch('https://api.github.com/users/'+userName);
        const data=await responses.json();
        const repo=data.public_repos
        //set redis cache
        client.setex(userName,3600,repo )    
        res.send(setrespo(userName,repo));

    }
    catch(err){
        console.log("erro occured");
        res.send(err)
    }


}
function setrespo(userName,repo){
return '<h1>'+userName+' this is '+repo+'</h1>'

}
function r_cache(req,res,next){
    const userName=req.params.username
    client.get(userName,(err,data)=>{
        if (err) throw err
        if (data !==null){
            res.send(setrespo(userName,data))
        }
        else{
            next();
        }
    })

}


app.listen(PORT,()=>{
    console.log("port is started")
})