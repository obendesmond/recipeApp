const express = require('express');

const app = express();

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
    //set static folder
    app.use(express.static("build"));
    app.get("*", (req, res) => {
      // load index.html file
      res.sendFile(path.resolve(__dirname, "build", "index.html"));
    });
  }
  
  // port
  const port = process.env.PORT || 3000;
  
  app.listen(port, () => console.log(`Server running on port ${port}`));