from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

# CORS for local React dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DUMMYJSON_BASE = "https://dummyjson.com"
DUMMYJSON_USERNAME = "emilys"
DUMMYJSON_PASSWORD = "emilyspass"

access_token = None  # in-memory for demo only


def login_to_dummyjson():
    global access_token
    resp = requests.post(
        f"{DUMMYJSON_BASE}/user/login",
        json={
            "username": DUMMYJSON_USERNAME,
            "password": DUMMYJSON_PASSWORD,
            "expiresInMins": 30,
        },
    )
    if resp.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to login to DummyJSON")
    data = resp.json()
    access_token = data.get("accessToken")
    if not access_token:
        raise HTTPException(status_code=500, detail="No token received from DummyJSON")


def get_auth_headers():
    global access_token
    if not access_token:
        login_to_dummyjson()
    return {"Authorization": f"Bearer {access_token}"}


@app.get("/api/token")
def get_token():
    """
    Example endpoint that returns the token to the frontend.
    In a real app you usually wouldn't expose this directly.
    """
    global access_token
    if not access_token:
        login_to_dummyjson()
    return {"accessToken": access_token}


@app.get("/api/dashboard")
def get_dashboard_data():
    """
    Dashboard endpoint: fetch products and users from DummyJSON
    using the stored token.
    """
    headers = get_auth_headers()

    # products (no auth required, but we include header to show usage)
    products_resp = requests.get(f"{DUMMYJSON_BASE}/products?limit=10", headers=headers)
    users_resp = requests.get(f"{DUMMYJSON_BASE}/users?limit=10", headers=headers)

    if products_resp.status_code != 200 or users_resp.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch dashboard data")

    products = products_resp.json().get("products", [])
    users = users_resp.json().get("users", [])

    return {
        "products": products,
        "users": users,
        "summary": {
            "totalProducts": len(products),
            "totalUsers": len(users),
        },
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

