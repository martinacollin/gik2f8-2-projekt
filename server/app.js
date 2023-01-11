const express = require('express');
const app = express();

const fs = require('fs/promises');

const PORT = 5000;
app
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', '*');
        res.header('Access-Control-Allow-Methods', '*');
        next();
    });

app.get('/blog-posts', async (req, res) => {
    try {
        const blogPosts = await fs.readFile('./blog-posts.json');
        let currentBlogPosts = JSON.parse(blogPosts);
        if (currentBlogPosts && currentBlogPosts.length > 1) {
            currentBlogPosts = currentBlogPosts.sort((a, b) => {
                if (a.createdDate > b.createdDate) {
                    return -1;
                } else if (a.createdDate < b.createdDate) {
                    return 1;
                } else {
                    return 0;
                }
            })
        }
        res.send(currentBlogPosts);
    } catch (error) {
        res.status(500).send({ error });
    }
});

app.post('/blog-posts', async (req, res) => {
    try {
        const blogPost = req.body;
        const listBuffer = await fs.readFile('./blog-posts.json');
        const currentBlogPosts = JSON.parse(listBuffer);
        let maxBlogPostId = 1;
        if (currentBlogPosts && currentBlogPosts.length > 0) {
            maxBlogPostId = currentBlogPosts.reduce(
                (maxId, currentElement) =>
                    currentElement.id > maxId ? currentElement.id : maxId,
                maxBlogPostId
            );
        }

        const newBlogPost = { id: maxBlogPostId + 1, ...blogPost };
        const newList = currentBlogPosts ? [...currentBlogPosts, newBlogPost] : [newBlogPost];

        await fs.writeFile('./blog-posts.json', JSON.stringify(newList));
        res.send(newBlogPost);
    } catch (error) {
        res.status(500).send({ error: error.stack });
    }
});

app.delete('/blog-posts/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const listBuffer = await fs.readFile('./blog-posts.json');
        const currentBlogPosts = JSON.parse(listBuffer);
        if (currentBlogPosts.length > 0) {
            const newList = currentBlogPosts.filter((blogPost) => blogPost.id != id)
            await fs.writeFile('./blog-posts.json', JSON.stringify(newList));
            res.send({ message: `Inlägg med id ${id} har tagits bort` });
        } else {
            res.status(404).send({ error: 'Inget inlägg att ta bort' });
        }
    } catch (error) {
        res.status(500).send({ error: error.stack });
    }
});

app.listen(PORT, () => console.log('Server running on http://localhost:5000'));
