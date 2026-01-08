#!/usr/bin/env python3
"""
Seed script for INFRA Observatory database.
Populates initial platforms and sample data.
"""

import asyncio
import uuid
from datetime import datetime, timedelta
import random
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import text

# Platforms data
PLATFORMS = [
    {
        "code": "infrabank",
        "name": "INFRABANK",
        "description": "Banca Digital Híbrida TradFi + DeFi",
        "color": "#00d4ff",
        "icon": "building-bank",
        "criticality": "critical",
    },
    {
        "code": "infrapay",
        "name": "INFRA PAY & TREASURY",
        "description": "Pagos Internacionales y Tesorería IA",
        "color": "#7c3aed",
        "icon": "credit-card",
        "criticality": "critical",
    },
    {
        "code": "infravault",
        "name": "INFRA VAULT CORE",
        "description": "Plataforma Multilateral de Liquidez",
        "color": "#10b981",
        "icon": "vault",
        "criticality": "critical",
    },
    {
        "code": "infradigital",
        "name": "INFRA DIGITAL ASSETS",
        "description": "Custodia y Trading Institucional",
        "color": "#f59e0b",
        "icon": "coins",
        "criticality": "critical",
    },
    {
        "code": "infracoinn",
        "name": "INFRACOINN",
        "description": "Tokenización de Activos Reales",
        "color": "#ec4899",
        "icon": "gem",
        "criticality": "high",
    },
    {
        "code": "infradevtech",
        "name": "INFRA Dev·Tech",
        "description": "DevTools SaaS Marketplace",
        "color": "#3b82f6",
        "icon": "code",
        "criticality": "high",
    },
    {
        "code": "infraforge",
        "name": "INFRA FORGE",
        "description": "Smart Contracts AI",
        "color": "#ef4444",
        "icon": "hammer",
        "criticality": "medium",
    },
    {
        "code": "infrainsurance",
        "name": "INFRA Global Insurance",
        "description": "Seguros Multi-Línea",
        "color": "#06b6d4",
        "icon": "shield-check",
        "criticality": "critical",
    },
    {
        "code": "infraschool",
        "name": "INFRA SCHOOL",
        "description": "EdTech + Fintech Educativo",
        "color": "#8b5cf6",
        "icon": "graduation-cap",
        "criticality": "medium",
    },
]

# Sample services per platform
SAMPLE_SERVICES = [
    {"name": "API Gateway", "slug": "api-gateway", "service_type": "gateway", "technology": "Kong/Node.js"},
    {"name": "Auth Service", "slug": "auth-service", "service_type": "api", "technology": "Python/FastAPI"},
    {"name": "User Service", "slug": "user-service", "service_type": "api", "technology": "Go"},
    {"name": "Notification Worker", "slug": "notification-worker", "service_type": "worker", "technology": "Python/Celery"},
    {"name": "PostgreSQL Primary", "slug": "postgres-primary", "service_type": "database", "technology": "PostgreSQL"},
    {"name": "Redis Cache", "slug": "redis-cache", "service_type": "cache", "technology": "Redis"},
]


async def seed_database(database_url: str):
    """Seed the database with initial data."""
    engine = create_async_engine(database_url)
    async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        # Check if platforms already exist
        result = await session.execute(text("SELECT COUNT(*) FROM platforms"))
        count = result.scalar()

        if count > 0:
            print(f"Database already has {count} platforms. Skipping seed.")
            return

        print("Seeding platforms...")
        for platform in PLATFORMS:
            platform_id = uuid.uuid4()
            status = random.choice(["healthy", "healthy", "healthy", "warning", "healthy"])
            health_score = random.uniform(85, 100) if status == "healthy" else random.uniform(60, 85)

            await session.execute(
                text("""
                    INSERT INTO platforms (id, code, name, description, color, icon, criticality, status, health_score, is_active, created_at, updated_at)
                    VALUES (:id, :code, :name, :description, :color, :icon, :criticality, :status, :health_score, true, :now, :now)
                """),
                {
                    "id": str(platform_id),
                    "code": platform["code"],
                    "name": platform["name"],
                    "description": platform["description"],
                    "color": platform["color"],
                    "icon": platform["icon"],
                    "criticality": platform["criticality"],
                    "status": status,
                    "health_score": round(health_score, 2),
                    "now": datetime.utcnow(),
                },
            )

            # Add sample services for each platform
            print(f"  Adding services for {platform['name']}...")
            num_services = random.randint(4, 8)
            for i, service in enumerate(SAMPLE_SERVICES[:num_services]):
                service_id = uuid.uuid4()
                service_status = "healthy" if random.random() > 0.1 else "warning"
                service_health = random.uniform(90, 100) if service_status == "healthy" else random.uniform(70, 90)

                await session.execute(
                    text("""
                        INSERT INTO services (id, platform_id, name, slug, service_type, technology, status, health_score, is_active, replicas, created_at, updated_at)
                        VALUES (:id, :platform_id, :name, :slug, :service_type, :technology, :status, :health_score, true, :replicas, :now, :now)
                    """),
                    {
                        "id": str(service_id),
                        "platform_id": str(platform_id),
                        "name": service["name"],
                        "slug": service["slug"],
                        "service_type": service["service_type"],
                        "technology": service["technology"],
                        "status": service_status,
                        "health_score": round(service_health, 2),
                        "replicas": random.randint(1, 5),
                        "now": datetime.utcnow(),
                    },
                )

        await session.commit()
        print("Database seeded successfully!")


if __name__ == "__main__":
    import os
    from dotenv import load_dotenv

    load_dotenv()
    database_url = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/observatory")

    asyncio.run(seed_database(database_url))
