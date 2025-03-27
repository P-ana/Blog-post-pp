import express from 'express';
import bodyParser from 'body-parser';


const app = express();
const port = 3000;


let posts=[];
let postId=0;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
;

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.render("index.ejs");});

app.get('/form', (req, res) => { 
        res.render('form.ejs', { 
            posts: posts, 
            error: null,
            post: postId
        });
    });

       
    
app.post("/submit", (req, res) => {
    try { 
            const title = req.body.title;
            const author = req.body.author;
            const content = req.body.content;
    
        if (!title || !author || !content) {
                throw new Error("All fields are required!");
            }

            postId+=1;
            posts.push({ id:postId,title, author, content });
            res.redirect("/form");
        } catch (error) {
            res.render("form.ejs", {
                error: error.message,
                posts:posts
            });
        }
    });


app.delete('/delete-post/:id', (req, res) => {
        const id = parseInt(req.params.id);
        const initialLength= posts.length;//This saves the original number of posts before we delete anything

        posts = posts.filter(post => post.id!== id);//t keeps all other posts where post.id !== id

        if(posts.length < initialLength) {// if it is deleted
            res.status(200).json({success:true, messsage: "Post deleted successfully"});
        } else {
            res.status(404).json({ success: false, message: "Post not found" });
        }   
});

app.put("/edit-post/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const postIndex=posts.findIndex(post => post.id === id);

   if (postIndex !== -1) {
    posts[postIndex].title=req.body.title;
    posts[postIndex].author=req.body.author;
    posts[postIndex].content=req.body.content;

    res.status(200).json({ success: true, message: "Post updated successfully", post: posts[postIndex]  });
   } else {
    res.status(404).json({ success: false, message: "Post not found" });
   }  
});



app.listen(port, () => {
    console.log(`listening on ${port}`);});