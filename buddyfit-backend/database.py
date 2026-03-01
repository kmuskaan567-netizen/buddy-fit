import psycopg2

def get_connection():
    return psycopg2.connect(
        host="localhost",
        database="buddyfit",
        user="postgres",
        password="admin123"   # change to your password
    )
