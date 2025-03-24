import express from 'express';
import bodyParser from 'body-parser';
const app = express();
const port = 3000;

let posts=[];
let postId=0;

app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render("index.ejs");});

app.get('/form', (req, res) => {
    res.render('form.ejs',{
        posts:posts,
        error: null,
        id: 0
        
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
app.delete("/delete-post", (req, res) => {
    try{
        const postIdToDelete=parseInt(req.body.postId);
        if(!postIdToDelete){
            throw new Error("Post ID is required!");
        }
        posts=posts.filter(post=>post.id!==postIdToDelete);
        res.status(200).json({ message: "Post deleted successfully!", remainingPosts: posts });
    }
    catch (error) {
        res.status(400).json({message:error.message});
    }
})
    

app.listen(port, () => {
    console.log(`listening on ${port}`);});