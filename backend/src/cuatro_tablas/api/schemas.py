from pydantic import BaseModel


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
