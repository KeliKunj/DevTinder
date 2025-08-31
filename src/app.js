const express = require('express');
const app = express();

app.use("/a{b}c", (req, res)=>{
    res.send('use /abc route');
});

// app.use("/user", (req, res)=>{
//     res.send('use /user route');
// });

app.get('/user', (req, res)=>{    
    res.send({firstname: 'Radhe', lastname: 'Shyam'});
});

app.post('/user', (req, res)=>{
    res.send("Saved  data successfully");
});

app.delete('/user', (req, res)=>{
    res.send("Deleted data successfully");
});

app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
});