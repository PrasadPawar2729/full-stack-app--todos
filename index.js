document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('bookForm');
    const message = document.getElementById('message');
    const booksList = document.getElementById('booksList');

    const handleUpload = async (file) => {
        // Implement your upload logic here
        // For simplicity, let's assume the server returns the file path after upload
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('https://todoapp-ooq9.onrender.com/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            return data.filePath;
        } catch (error) {
            console.error('Error uploading file:', error);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const price = document.getElementById('price').value;
        const bgImage = document.getElementById('bgImage').files[0];

        if (!name || !price || !bgImage) {
            message.textContent = 'Please fill in all fields and upload an image.';
            return;
        }

        const bgImagePath = await handleUpload(bgImage);

        if (!bgImagePath) {
            message.textContent = 'Error uploading image.';
            return;
        }

        try {
            const response = await fetch('https://todoapp-ooq9.onrender.com/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, price, bgImage: bgImagePath }),
            });

            const book = await response.json();
            addBookToList(book);
            bookForm.reset();
            message.textContent = 'Book created successfully!';
        } catch (error) {
            console.error('Error creating book:', error);
            message.textContent = 'Error creating book.';
        }
    };

    const addBookToList = (book) => {
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book');

        const bookName = document.createElement('h3');
        bookName.textContent = book.name;

        const bookPrice = document.createElement('p');
        bookPrice.textContent = `Price: $${book.price}`;

        const bookImage = document.createElement('img');
        bookImage.src = `https://todoapp-ooq9.onrender.com/${book.bgImage}`;
        bookImage.alt = book.name;

        bookDiv.appendChild(bookName);
        bookDiv.appendChild(bookPrice);
        bookDiv.appendChild(bookImage);

        booksList.appendChild(bookDiv);
    };

    bookForm.addEventListener('submit', handleSubmit);
});