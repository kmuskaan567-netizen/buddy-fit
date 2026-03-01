from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from database import get_connection
from ai_service import generate_meal_plan

app = FastAPI()

# CORS (React ↔ FastAPI)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- MODELS ----------

class User(BaseModel):
    name: str
    email: str
    age: int | None = None
    gender: str | None = None
    height: float | None = None
    weight: float | None = None
    goal: str | None = None
    activity: str | None = None

# ---------- USER APIs ----------

@app.post("/add_user")
def add_user(user: User):
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            """
            INSERT INTO users (name, email, age, gender, height, weight, goal, activity)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                user.name,
                user.email,
                user.age,
                user.gender,
                user.height,
                user.weight,
                user.goal,
                user.activity
            )
        )
        conn.commit()
        return {"status": "User added successfully"}

    except Exception as e:
        conn.rollback()
        print("DB Error:", e)
        raise HTTPException(status_code=400, detail="Error adding user")

    finally:
        cur.close()
        conn.close()


@app.get("/users")
def get_users():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT id, name, email FROM users ORDER BY id DESC")
    rows = cur.fetchall()

    cur.close()
    conn.close()

    return [{"id": r[0], "name": r[1], "email": r[2]} for r in rows]

# ---------- AI MEAL PLAN API ----------

@app.post("/ai/meal-plan/{user_id}")
def ai_meal_plan(user_id: int):
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            """
            SELECT age, gender, height, weight, goal, activity
            FROM users
            WHERE id = %s
            """,
            (user_id,)
        )

        row = cur.fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="User not found")

        user_profile = {
            "age": row[0],
            "gender": row[1],
            "height": row[2],
            "weight": row[3],
            "goal": row[4],
            "activity": row[5],
        }

        meal_plan = generate_meal_plan(user_profile)

        return {"meal_plan": meal_plan}

    except Exception as e:
        print("AI Error:", e)
        raise HTTPException(status_code=500, detail="AI generation failed")

    finally:
        cur.close()
        conn.close()
