"""
Aplicación principal FastAPI con GraphQL
ISO/IEC 25022: Punto de entrada de la aplicación
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import strawberry
from strawberry.fastapi import GraphQLRouter
import logging
from app.config import settings
from app.database import init_db
from app.resolvers import Query, Mutation

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Crear esquema GraphQL
schema = strawberry.Schema(query=Query, mutation=Mutation)

# Crear aplicación FastAPI
app = FastAPI(
    title=settings.api_title,
    description=settings.api_description,
    version=settings.api_version,
    docs_url="/graphql",
)

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GraphQL Router
graphql_app = GraphQLRouter(schema)
app.include_router(graphql_app, prefix="/graphql")


@app.on_event("startup")
async def startup_event():
    """Evento de inicio"""
    logger.info("Iniciando aplicación...")
    init_db()
    logger.info("Aplicación iniciada correctamente")


@app.on_event("shutdown")
async def shutdown_event():
    """Evento de cierre"""
    logger.info("Apagando aplicación...")


@app.get("/health")
async def health_check():
    """
    Health check endpoint
    
    Returns:
        dict: Estado de la aplicación
    """
    return {
        "status": "ok",
        "version": settings.api_version,
        "service": settings.api_title
    }


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "MVP GraphQL Authentication API",
        "graphql_url": "/graphql",
        "health_url": "/health",
        "version": settings.api_version
    }


if __name__ == "__main__":
    import uvicorn
    
    logger.info(f"Iniciando servidor en http://localhost:8000")
    logger.info(f"GraphQL Playground disponible en http://localhost:8000/graphql")
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
