import os
from openai import OpenAI

# Create OpenAI client using environment variable
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_meal_plan(user_profile: dict) -> str:
    prompt = f"""
Create a simple 1-day healthy meal plan.

User details:
Age: {user_profile.get('age')}
Gender: {user_profile.get('gender')}
Height: {user_profile.get('height')} cm
Weight: {user_profile.get('weight')} kg
Goal: {user_profile.get('goal')}
Activity level: {user_profile.get('activity')}

Include:
- Breakfast
- Lunch
- Dinner
- One Snack
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a professional nutritionist."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )

    return response.choices[0].message.content
