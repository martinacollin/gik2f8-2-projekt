const api = new Api('http://localhost:5000/blog-posts');

const blogPostsContainerElement = document.getElementById('blogPostsContainer');
const blogPostForm = document.getElementById('blogPostForm');

blogPostForm.addEventListener('submit', onSubmit);

function onSubmit(e) {
    e.preventDefault();
    saveBlogPost();
}

function saveBlogPost() {
    const blogPost = {
        title: blogPostForm.title.value,
        text: blogPostForm.text.value,
        createdDate: new Date()
    };

    api.create(blogPost).then((blogPost) => {
        if (blogPost) {
            renderList();
        }
    });
}

function renderList() {
    console.log('rendering');
    api.getAll().then((blogPosts) => {
        blogPostsContainerElement.innerHTML = '';
        if (blogPosts && blogPosts.length > 0) {
            blogPosts.forEach((blogPost) => {
                blogPostsContainerElement.insertAdjacentHTML('beforeend', renderBlogPost(blogPost));
            });
        }
    });
}

function renderBlogPost({ id, title, text, createdDate }) {
    const formattedDate = Intl.DateTimeFormat('sv-SE', {
        dateStyle: 'long',
        timeStyle: 'long'
    }).format(new Date(createdDate));

    let html = `<article class="pb-3 mb-5 border-bottom">
        <div class="d-flex justify-content-between align-items-center mb-2">
            <h2>${title}</h2>
            <button onclick="deleteBlogPost(${id})" type="button" class="btn-close" aria-label="Close"></button>
        </div>
        <p>${text}</p>  
        <span class="fst-italic text-small">${formattedDate}</span>
    </article>`;

    return html;
}

function deleteBlogPost(id) {
    api.remove(id).then((result) => {
        renderList();
    });
}

renderList();