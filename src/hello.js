
export default {
  async fetch(request) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Colorful Webpage</title>
          <style>
            body {
              font-family: sans-serif;
              background-color: #282c34;
              color: white;
              margin: 0;
              display: flex;
              flex-direction: column;
              min-height: 100vh;
            }
            .navbar {
              background-color: #20232a;
              padding: 1em;
              display: flex;
              justify-content: space-around;
            }
            .navbar a {
              color: white;
              text-decoration: none;
              font-size: 1.2em;
            }
            .content {
              flex-grow: 1;
            }
            .footer {
              background-color: #20232a;
              padding: 1em;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="navbar">
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
          </div>
          <div class="content">
            
          </div>
          <div class="footer">
            <p>&copy; 2024 My Awesome Website</p>
          </div>
        </body>
      </html>
    `;
    return new Response(html, {
      headers: { "content-type": "text/html" },
    });
  },
};
