document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav ul li a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                if (section.id === sectionId) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
});

function postMusing() {
    const username = document.getElementById('username').value.trim();
    const content = document.getElementById('musing-content').value.trim();
    const imageFile = document.getElementById('musing-image').files[0];
    const postsDiv = document.getElementById('musings-posts');

    if (username === "" || content === "") {
        alert("Username and content are required.");
        return;
    }

    const postDiv = document.createElement('div');
    postDiv.classList.add('musing-post');

    const dateSpan = document.createElement('span');
    dateSpan.textContent = new Date().toLocaleDateString();
    postDiv.appendChild(dateSpan);

    const userSpan = document.createElement('span');
    userSpan.textContent = username + ': ';
    postDiv.appendChild(userSpan);

    const contentP = document.createElement('p');
    contentP.textContent = content;
    postDiv.appendChild(contentP);

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = "User posted image";
            img.style.maxWidth = "200px";
            postDiv.appendChild(img);
        };
        reader.readAsDataURL(imageFile);
    }

    const deleteButton = document.createElement('button');
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function() {
        postsDiv.removeChild(postDiv);
    };
    postDiv.appendChild(deleteButton);

    postsDiv.appendChild(postDiv);

    // Reset input fields
    document.getElementById('username').value = '';
    document.getElementById('musing-content').value = '';
    document.getElementById('musing-image').value = '';
}
