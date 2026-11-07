from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, EmailStr, Field

from cuatro_tablas.domain.configuration import (
    DEFAULT_LEG_SECTION_CM,
    DEFAULT_TOP_THICKNESS_CM,
    TableConfiguration,
)
from cuatro_tablas.domain.quote_request import Contact


class OptionOut(BaseModel):
    id: str
    name: str


class RangeOut(BaseModel):
    min: int
    max: int


class LimitsOut(BaseModel):
    width_cm: RangeOut
    depth_cm: RangeOut
    height_cm: RangeOut
    top_thickness_cm: RangeOut
    leg_section_cm: RangeOut


class CatalogOut(BaseModel):
    materials: list[OptionOut]
    finishes: list[OptionOut]
    limits: LimitsOut


class TableConfigurationIn(BaseModel):
    """Shape and types only. Business limits are enforced by the domain."""

    width_cm: int
    depth_cm: int
    height_cm: int
    material_id: str = Field(max_length=50)
    finish_id: str = Field(max_length=50)
    top_thickness_cm: int = DEFAULT_TOP_THICKNESS_CM
    leg_section_cm: int = DEFAULT_LEG_SECTION_CM

    def to_domain(self) -> TableConfiguration:
        return TableConfiguration(**self.model_dump())


class QuoteOut(BaseModel):
    total_cop: int
    currency: str = "COP"


class ContactIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr | None = None
    phone: str | None = Field(default=None, max_length=30)
    message: str | None = Field(default=None, max_length=1000)

    def to_domain(self) -> Contact:
        return Contact(**self.model_dump())


class QuoteRequestIn(BaseModel):
    configuration: TableConfigurationIn
    contact: ContactIn


class QuoteRequestCreatedOut(BaseModel):
    id: str
    total_cop: int


class ContactOut(BaseModel):
    name: str
    email: str | None
    phone: str | None
    message: str | None


class LineItemOut(BaseModel):
    concept: str
    amount_cop: int


class AdminQuoteRequestOut(BaseModel):
    id: str
    created_at: datetime
    configuration: TableConfigurationIn
    contact: ContactOut
    items: list[LineItemOut]
    subtotal_cop: int
    markup_rate: Decimal
    total_cop: int
