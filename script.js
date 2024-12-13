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

    // Load musings from localStorage when the page loads
    loadMusings();
});

// 获取元素
const video = document.getElementById('intro-video');
const aboutText = document.getElementById('about-text');
const aboutParas = aboutText.querySelectorAll('p');

// 当视频播放结束时显示文字并淡入
video.addEventListener('ended', () => {
  // 隐藏视频
  video.style.display = 'none';
  // 显示文字容器
  aboutText.style.display = 'block';
  // 一行一行淡入显示
  fadeInLines(aboutParas, 0);
});

function fadeInLines(lines, index) {
  if (index < lines.length) {
    lines[index].classList.add('show');
    setTimeout(() => {
      fadeInLines(lines, index + 1);
    }, 500); // 每行延迟0.5秒淡入下一行，可根据需要调整
  }
}

// 如果用户通过进度条将视频拉到末尾，也会触发ended事件
video.addEventListener('timeupdate', () => {
  if (video.duration > 0 && (video.currentTime >= video.duration - 0.1)) {
    video.dispatchEvent(new Event('ended'));
  }
});

document.querySelectorAll('.video-container').forEach(container => {
    const video = container.querySelector('video');

    // 鼠标悬停播放视频
    container.addEventListener('mouseenter', () => {
        video.play();
    });

    // 鼠标移出暂停视频
    container.addEventListener('mouseleave', () => {
        video.pause();
    });
});

function postMusing() {
    const username = document.getElementById('username').value.trim();
    const content = document.getElementById('musing-content').value.trim();
    const imageFile = document.getElementById('musing-image').files[0];

    if (username === "" || content === "") {
        alert("Username and content are required.");
        return;
    }

    const musing = {
        username,
        content,
        date: new Date().toLocaleDateString(),
        image: null
    };

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            musing.image = e.target.result;
            saveMusing(musing);
        };
        reader.readAsDataURL(imageFile);
    } else {
        saveMusing(musing);
    }
}

function saveMusing(musing) {
    const musings = JSON.parse(localStorage.getItem('musings')) || [];
    musings.push(musing);
    localStorage.setItem('musings', JSON.stringify(musings));
    displayMusing(musing);
}

function loadMusings() {
    const musings = JSON.parse(localStorage.getItem('musings')) || [];
    musings.forEach(musing => displayMusing(musing));
}

function displayMusing(musing) {
    const postsDiv = document.getElementById('musings-posts');
    const postDiv = document.createElement('div');
    postDiv.classList.add('musing-post');

    const dateSpan = document.createElement('span');
    dateSpan.textContent = musing.date;
    postDiv.appendChild(dateSpan);

    const userSpan = document.createElement('span');
    userSpan.textContent = musing.username + ': ';
    postDiv.appendChild(userSpan);

    const contentP = document.createElement('p');
    contentP.textContent = musing.content;
    postDiv.appendChild(contentP);

    if (musing.image) {
        const img = document.createElement('img');
        img.src = musing.image;
        img.alt = "User posted image";
        img.style.maxWidth = "200px";
        postDiv.appendChild(img);
    }

    const deleteButton = document.createElement('button');
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function() {
        postsDiv.removeChild(postDiv);
        // Also remove from localStorage
        removeMusing(musing);
    };
    postDiv.appendChild(deleteButton);

    postsDiv.appendChild(postDiv);

    // Reset input fields
    document.getElementById('username').value = '';
    document.getElementById('musing-content').value = '';
    document.getElementById('musing-image').value = '';
}

function removeMusing(musingToRemove) {
    let musings = JSON.parse(localStorage.getItem('musings')) || [];
    musings = musings.filter(musing => musing.date !== musingToRemove.date || musing.username !== musingToRemove.username || musing.content !== musingToRemove.content);
    localStorage.setItem('musings', JSON.stringify(musings));
}