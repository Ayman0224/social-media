const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// ====================
// Home
// ====================

app.get("/", (req, res) => {
    res.send("Hello from backend");
});


// ====================
// Get Users
// ====================

app.get("/users", async (req, res) => {

    const result = await pool.query(
        "SELECT * FROM users"
    );

    res.json(result.rows);
});


// ====================
// Create Post
// ====================

app.post("/posts", async (req, res) => {

    const { user_id, content } = req.body;

    const result = await pool.query(
        "INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING *",
        [user_id, content]
    );

    res.json(result.rows[0]);
});


// ====================
// Get Posts
// ====================

app.get("/posts", async (req, res) => {

    const result = await pool.query(
        "SELECT * FROM posts ORDER BY created_at DESC"
    );

    res.json(result.rows);
});


// ====================
// Create Comment
// ====================

app.post("/comments", async (req, res) => {

    const { post_id, user_id, content } = req.body;

    const result = await pool.query(
        "INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *",
        [post_id, user_id, content]
    );

    res.json(result.rows[0]);
});

app.post("/likes", async (req, res) => {

    const { post_id, user_id } = req.body;

    const existingLike = await pool.query(
        "SELECT * FROM likes WHERE post_id = $1 AND user_id = $2",
        [post_id, user_id]
    );

    if (existingLike.rows.length > 0) {

        await pool.query(
            "DELETE FROM likes WHERE post_id = $1 AND user_id = $2",
            [post_id, user_id]
        );

        res.json({ liked: false });

    } else {

        await pool.query(
            "INSERT INTO likes (post_id, user_id) VALUES ($1, $2)",
            [post_id, user_id]
        );

        res.json({ liked: true });

    }

});

app.post("/follow", async (req, res) => {

    const { follower_id, following_id } = req.body;

    const existingFollow = await pool.query(
        "SELECT * FROM followers WHERE follower_id = $1 AND following_id = $2",
        [follower_id, following_id]
    );

    if (existingFollow.rows.length > 0) {

        await pool.query(
            "DELETE FROM followers WHERE follower_id = $1 AND following_id = $2",
            [follower_id, following_id]
        );

        res.json({ following: false });

    } else {

        await pool.query(
            "INSERT INTO followers (follower_id, following_id) VALUES ($1, $2)",
            [follower_id, following_id]
        );

        res.json({ following: true });

    }

});

// ====================
// Start Server
// ====================
app.get("/profile/:id", async (req, res) => {

    const userId = req.params.id;

    const posts = await pool.query(
        "SELECT COUNT(*) FROM posts WHERE user_id = $1",
        [userId]
    );

    const followers = await pool.query(
        "SELECT COUNT(*) FROM followers WHERE following_id = $1",
        [userId]
    );

    const following = await pool.query(
        "SELECT COUNT(*) FROM followers WHERE follower_id = $1",
        [userId]
    );

    res.json({
        posts: Number(posts.rows[0].count),
        followers: Number(followers.rows[0].count),
        following: Number(following.rows[0].count)
    });

});
app.get("/follow/:followerId/:followingId", async (req, res) => {

    const { followerId, followingId } = req.params;

    const result = await pool.query(
        "SELECT * FROM followers WHERE follower_id = $1 AND following_id = $2",
        [followerId, followingId]
    );

    res.json({
        following: result.rows.length > 0
    });

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});