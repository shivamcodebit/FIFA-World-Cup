"""
CrowdSnapshot SQLAlchemy model.
Stores periodic crowd density readings per zone.
"""
import datetime
from sqlalchemy import String, DateTime, Integer, Float
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


def _utcnow() -> datetime.datetime:
    return datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None)


class CrowdSnapshot(Base):
    __tablename__ = "crowd_snapshots"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    zone_id: Mapped[str] = mapped_column(String(30), index=True, nullable=False)
    zone_name: Mapped[str] = mapped_column(String(100), nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    current_count: Mapped[int] = mapped_column(Integer, nullable=False)
    density_pct: Mapped[float] = mapped_column(Float, nullable=False)
    queue_length: Mapped[int] = mapped_column(Integer, default=0)
    timestamp: Mapped[datetime.datetime] = mapped_column(
        DateTime, default=_utcnow, nullable=False, index=True
    )
