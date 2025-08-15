from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

# create flask app
app = Flask(__name__)
CORS(app)

# database name
DB_NAME = "database.db"

# function to make database tables
def create_tables():
    conn = sqlite3.connect(DB_NAME)
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            email TEXT UNIQUE,
            password TEXT
        )
    """)
    # Migration: ensure 'email' column exists (older DBs didn't have it)
    cur.execute("PRAGMA table_info(users)")
    cols = [row[1] for row in cur.fetchall()]
    if "email" not in cols:
        # Add column without UNIQUE (SQLite doesn't allow adding UNIQUE via ALTER)
        cur.execute("ALTER TABLE users ADD COLUMN email TEXT")
        # Add unique index separately
        cur.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email)")
    cur.execute("""
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            comment TEXT,
            rating INTEGER,
            sentiment TEXT
        )
    """)
    conn.commit()
    conn.close()

create_tables()

# train AI model
data = pd.read_csv("EmotionDetection.csv")
X = data['text']
y = data['Emotion']

vectorizer = CountVectorizer()
X_vec = vectorizer.fit_transform(X)

model = MultinomialNB()
model.fit(X_vec, y)

# function to predict emotion
def get_emotion(text):
    text_vec = vectorizer.transform([text])
    return model.predict(text_vec)[0]

# signup route
@app.route("/signup", methods=["POST"])
def signup():
    info = request.json
    username = (info.get("username") or "").strip()
    email = (info.get("email") or "").strip().lower()
    password = info.get("password")
    confirm = info.get("confirm_password")

    if not username or not email or not password or not confirm:
        return jsonify({"error": "All fields are required"}), 400
    if password != confirm:
        return jsonify({"error": "Passwords do not match"}), 400

    conn = sqlite3.connect(DB_NAME)
    cur = conn.cursor()
    # Check duplicates explicitly for clearer errors
    cur.execute("SELECT 1 FROM users WHERE username = ?", (username,))
    if cur.fetchone():
        conn.close()
        return jsonify({"error": "Username already exists"}), 400

    cur.execute("SELECT 1 FROM users WHERE email = ?", (email,))
    if cur.fetchone():
        conn.close()
        return jsonify({"error": "Email already exists"}), 400

    try:
        cur.execute(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            (username, email, password),
        )
        conn.commit()
        return jsonify({"message": "User registered"})
    except Exception as e:
        return jsonify({"error": "Could not register user"}), 400
    finally:
        conn.close()

# signin route
@app.route("/signin", methods=["POST"])
def signin():
    info = request.json
    email = (info.get("email") or "").strip().lower()
    password = info.get("password")

    conn = sqlite3.connect(DB_NAME)
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE email=? AND password=?", (email, password))
    user = cur.fetchone()
    conn.close()

    if user:
        return jsonify({"message": "Login OK", "user_id": user[0]})
    else:
        return jsonify({"error": "Invalid email or password"}), 401

# feedback route
@app.route("/feedback", methods=["POST"])
def feedback():
    info = request.json
    user_id = info.get("user_id")
    comment = info.get("comment")
    rating = info.get("rating")

    try:
        rating = int(rating)
    except Exception:
        return jsonify({"error": "Rating must be a number between 1 and 5"}), 400
    if rating < 1 or rating > 5:
        return jsonify({"error": "Rating must be between 1 and 5"}), 400

    sentiment = get_emotion(comment)

    conn = sqlite3.connect(DB_NAME)
    cur = conn.cursor()
    cur.execute("INSERT INTO feedback (user_id, comment, rating, sentiment) VALUES (?, ?, ?, ?)",
                (user_id, comment, rating, sentiment))
    conn.commit()
    conn.close()

    return jsonify({"message": "Feedback saved", "sentiment": sentiment})

# List all feedback (for admin dashboard)
@app.route("/feedback", methods=["GET"])
def list_feedback():
    conn = sqlite3.connect(DB_NAME)
    cur = conn.cursor()
    cur.execute("SELECT id, user_id, comment, rating, sentiment FROM feedback ORDER BY id DESC")
    rows = cur.fetchall()
    conn.close()
    feedback = [
        {"id": r[0], "user_id": r[1], "comment": r[2], "rating": r[3], "sentiment": r[4]}
        for r in rows
    ]
    return jsonify({"feedback": feedback})

# Delete a single feedback by id
@app.route("/feedback/<int:fid>", methods=["DELETE"])
def delete_feedback(fid):
    conn = sqlite3.connect(DB_NAME)
    cur = conn.cursor()
    cur.execute("DELETE FROM feedback WHERE id=?", (fid,))
    conn.commit()
    deleted = cur.rowcount
    conn.close()
    if deleted == 0:
        return jsonify({"error": "Feedback not found"}), 404
    return jsonify({"message": "Deleted"})

# Delete all feedback
@app.route("/feedback_all", methods=["DELETE"])
def delete_all_feedback():
    conn = sqlite3.connect(DB_NAME)
    cur = conn.cursor()
    cur.execute("DELETE FROM feedback")
    conn.commit()
    conn.close()
    return jsonify({"message": "All feedback deleted"})

# admin route
@app.route("/admin", methods=["POST"])
def admin():
    info = request.json
    username = info.get("username")
    password = info.get("password")

    if username == "admin" and password == "admin123":
        conn = sqlite3.connect(DB_NAME)
        cur = conn.cursor()
        cur.execute("SELECT * FROM feedback")
        rows = cur.fetchall()
        conn.close()

        all_feedback = []
        for row in rows:
            all_feedback.append({
                "id": row[0],
                "user_id": row[1],
                "comment": row[2],
                "rating": row[3],
                "sentiment": row[4]
            })
        return jsonify({"feedback": all_feedback})
    else:
        return jsonify({"error": "Wrong admin login"}), 401

if __name__ == "__main__":
    app.run(debug=True)
