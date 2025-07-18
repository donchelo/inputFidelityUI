import os
import base64
from io import BytesIO
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from openai import OpenAI
from PIL import Image

app = FastAPI()

# Middleware de CORS para permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # O ["http://localhost:3000"] para mayor seguridad
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "<TU_API_KEY>")
client = OpenAI(api_key=OPENAI_API_KEY)

@app.post("/edit-image/")
async def edit_image(prompt: str = Form(...), image: UploadFile = File(...)):
    # Leer la imagen subida
    image_bytes = await image.read()
    image_file = BytesIO(image_bytes)
    image_file.name = image.filename

    # Llamar a la API de OpenAI
    result = client.images.edit(
        model="gpt-image-1",
        image=image_file,
        prompt=prompt,
        input_fidelity="high",
        quality="high",
        output_format="jpeg"
    )

    # Decodificar la imagen generada
    image_base64 = result.data[0].b64_json
    return JSONResponse(content={"image_base64": image_base64})

# Endpoint de salud
@app.get("/")
def health():
    return {"status": "ok"} 