from pydantic import BaseModel, Field

from cuatro_tablas.domain.configuration import (
    DEFAULT_LEG_SECTION_CM,
    DEFAULT_TOP_THICKNESS_CM,
    TableConfiguration,
)


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
